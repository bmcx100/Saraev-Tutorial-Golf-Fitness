import { useState } from 'react';
import {
  Platform,
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';
import { supabase } from '@/lib/supabase';
import { redirectTo, createSessionFromUrl } from '@/contexts/auth-context';

interface AppleAuthProps {
  onError: (message: string) => void;
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

      // Capture full name immediately — Apple only provides it on the very first sign-in
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
      // User cancelled — handle silently
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
  const colors = useColors();
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
      style={[
        styles.button,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} size="small" />
      ) : (
        <>
          <MaterialIcons name="apple" size={20} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>
            Continue with Apple
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  appleButton: {
    height: 50,
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
