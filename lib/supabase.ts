import 'react-native-get-random-values';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as aesjs from 'aes-js';
import * as SecureStore from 'expo-secure-store';

/**
 * LargeSecureStore encrypts session data with AES-256 before storing in
 * AsyncStorage. The 256-bit encryption key is kept in SecureStore (which has
 * a 2048-byte limit — too small for full session tokens, hence the wrapper).
 *
 * On web, SecureStore is unavailable so we fall back to plain AsyncStorage.
 */
class LargeSecureStore {
  private async _encrypt(key: string, value: string) {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(256 / 8));

    const cipher = new aesjs.ModeOfOperation.ctr(
      encryptionKey,
      new aesjs.Counter(1),
    );
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

    await SecureStore.setItemAsync(
      key,
      aesjs.utils.hex.fromBytes(encryptionKey),
    );

    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  private async _decrypt(key: string, value: string) {
    const encryptionKeyHex = await SecureStore.getItemAsync(key);
    if (!encryptionKeyHex) return null;

    const cipher = new aesjs.ModeOfOperation.ctr(
      aesjs.utils.hex.toBytes(encryptionKeyHex),
      new aesjs.Counter(1),
    );
    const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(value));

    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  async getItem(key: string) {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return null;
      return AsyncStorage.getItem(key);
    }
    const encrypted = await AsyncStorage.getItem(key);
    if (!encrypted) return null;
    return await this._decrypt(key, encrypted);
  }

  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return;
      return AsyncStorage.setItem(key, value);
    }
    const encrypted = await this._encrypt(key, value);
    await AsyncStorage.setItem(key, encrypted);
  }

  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined') return;
      return AsyncStorage.removeItem(key);
    }
    await AsyncStorage.removeItem(key);
    await SecureStore.deleteItemAsync(key);
  }
}

const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL || '').trim();
const supabaseAnonKey = (process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '').trim();

// When credentials are missing (e.g. web builds without env vars), export a
// deep no-op proxy so the app boots without crashing. Every property access
// returns another proxy, and every function call resolves to { data: null, error: null }.
function createNoopProxy(): any {
  const handler: ProxyHandler<any> = {
    get(_target, _prop) {
      // Return a callable proxy for chaining (e.g. supabase.auth.onAuthStateChange)
      return new Proxy(() => {}, {
        get: handler.get!,
        apply() {
          return { data: { subscription: { unsubscribe() {} }, session: null }, error: null };
        },
      });
    },
    apply() {
      return { data: null, error: null };
    },
  };
  return new Proxy(() => {}, handler);
}

export const supabaseAvailable = !!(supabaseUrl && supabaseAnonKey);

export const supabase: ReturnType<typeof createClient<Database>> = supabaseAvailable
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: new LargeSecureStore(),
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web',
      },
    })
  : createNoopProxy();
