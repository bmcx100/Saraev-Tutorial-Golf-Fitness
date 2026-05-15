import { useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/lib/supabase';
import { redirectTo, createSessionFromUrl } from '@/contexts/auth-context';
import {
  ink,
  rule,
  FontFamily,
} from '@/constants/design-tokens';

interface AppleAuthProps {
  onError: (message: string) => void;
}

function AppleIcon({ size = 15, color = ink }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-1.55 4.36-3.74 4.25z" />
    </Svg>
  );
}

export function AppleAuth({ onError }: AppleAuthProps) {
  if (Platform.OS === 'android') {
    return <AppleAuthAndroid onError={onError} />;
  }
  if (Platform.OS === 'ios') {
    return <AppleAuthIOS onError={onError} />;
  }
  // Not available on web
  return null;
}

function AppleAuthIOS({ onError }: AppleAuthProps) {
  const colorScheme = useColorScheme();

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        onError('Apple Sign-In failed: no identity token received');
        return;
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) {
        onError(error.message);
        return;
      }

      // Capture full name immediately -- Apple only provides it on the very first sign-in
      if (credential.fullName) {
        const { givenName, familyName } = credential.fullName;
        if (givenName || familyName) {
          const nameParts = [givenName, familyName].filter(Boolean);
          await supabase.auth.updateUser({
            data: {
              full_name: nameParts.join(' '),
              first_name: givenName ?? undefined,
              last_name: familyName ?? undefined,
            },
          });
        }
      }
    } catch (err: unknown) {
      // User cancelled -- handle silently
      if (
        err instanceof Error &&
        'code' in err &&
        (err as Error & { code: string }).code === 'ERR_REQUEST_CANCELED'
      ) {
        return;
      }
      const message =
        err instanceof Error ? err.message : 'Apple Sign-In failed';
      onError(message);
    }
  };

  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={
        colorScheme === 'dark'
          ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
          : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
      }
      cornerRadius={14}
      style={styles.appleButton}
      onPress={handleAppleSignIn}
    />
  );
}

function AppleAuthAndroid({ onError }: AppleAuthProps) {
  const [loading, setLoading] = useState(false);

  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        onError(error.message);
        return;
      }

      if (!data.url) {
        onError('Apple Sign-In failed: no auth URL received');
        return;
      }

      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (res.type === 'success') {
        await createSessionFromUrl(res.url);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Apple Sign-In failed';
      onError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handleAppleSignIn}
      disabled={loading}
      style={styles.button}
    >
      {loading ? (
        <ActivityIndicator color={ink} size="small" />
      ) : (
        <>
          <AppleIcon />
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  appleButton: {
    height: 48,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: rule,
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 10,
  },
  buttonText: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 13.5,
    color: ink,
  },
});
