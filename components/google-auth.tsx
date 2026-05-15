import { useState } from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import { supabase } from '@/lib/supabase';
import {
  ink,
  rule,
  FontFamily,
} from '@/constants/design-tokens';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

interface GoogleAuthProps {
  onError: (message: string) => void;
  onLoadingChange?: (loading: boolean) => void;
  disabled?: boolean;
}

function GoogleGIcon({ size = 15 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.7 4.7-6.2 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <Path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.4 6.3 14.7z" />
      <Path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.1 0-9.5-3.3-11.2-7.9l-6.6 5.1C9.6 39.6 16.3 44 24 44z" />
      <Path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.2 5.2C42 35 44 30 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </Svg>
  );
}

export function GoogleAuth({ onError, onLoadingChange, disabled }: GoogleAuthProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      onLoadingChange?.(true);
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const idToken = response.data.idToken;
        if (!idToken) {
          onError('Google Sign-In failed: no ID token received');
          return;
        }
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
        });
        if (error) onError(error.message);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Google Sign-In failed';
      onError(message);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <Pressable
      onPress={handleGoogleSignIn}
      disabled={loading || disabled}
      style={styles.button}
    >
      {loading ? (
        <ActivityIndicator color={ink} size="small" />
      ) : (
        <>
          <GoogleGIcon />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
