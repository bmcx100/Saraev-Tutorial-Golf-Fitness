import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';
import { supabase } from '@/lib/supabase';
import { createSessionFromUrl, redirectTo } from '@/contexts/auth-context';
import { GoogleAuth } from '@/components/google-auth';
import { AppleAuth } from '@/components/apple-auth';

type AuthMode = 'sign-in' | 'sign-up' | 'magic-link';

export default function LoginScreen() {
  const colors = useColors();
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle deep links for magic link callback
  const url = Linking.useURL();
  if (url) {
    createSessionFromUrl(url).catch(() => {
      // onAuthStateChange handles success; errors are silent
    });
  }

  const clearState = () => {
    setError('');
    setMessage('');
  };

  const switchMode = (newMode: AuthMode) => {
    clearState();
    setMode(newMode);
  };

  const handleSignIn = async () => {
    clearState();
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError) setError(signInError.message);
    setLoading(false);
  };

  const handleSignUp = async () => {
    clearState();
    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError) {
      setError(signUpError.message);
    } else if (!data.session) {
      setMessage('Check your email to confirm your account');
    }
    // If session exists, onAuthStateChange handles the redirect
    setLoading(false);
  };

  const handleMagicLink = async () => {
    clearState();
    setLoading(true);
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (otpError) {
      setError(otpError.message);
    } else {
      setMessage('Check your email for a sign-in link');
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    if (mode === 'sign-in') handleSignIn();
    else if (mode === 'sign-up') handleSignUp();
    else handleMagicLink();
  };

  const buttonLabel =
    mode === 'sign-in'
      ? 'Sign In'
      : mode === 'sign-up'
        ? 'Create Account'
        : 'Send Magic Link';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo / App name */}
          <View style={styles.logoArea}>
            <View style={[styles.logoCircle, { backgroundColor: colors.tint }]}>
              <MaterialIcons name="sports-golf" size={40} color="#fff" />
            </View>
            <Text style={[styles.appName, { color: colors.text }]}>
              Golf Fitness
            </Text>
            <Text style={[styles.appTagline, { color: colors.textSecondary }]}>
              Train smarter, play&nbsp;better
            </Text>
          </View>

          {/* Form card */}
          <View style={[styles.formCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>
              {mode === 'sign-in'
                ? 'Welcome Back'
                : mode === 'sign-up'
                  ? 'Create Account'
                  : 'Magic Link'}
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
            />

            {mode !== 'magic-link' && (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType={mode === 'sign-up' ? 'newPassword' : 'password'}
              />
            )}

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={[styles.submitButton, { backgroundColor: colors.tint }]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>{buttonLabel}</Text>
              )}
            </Pressable>

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            {message ? (
              <Text style={[styles.messageText, { color: colors.accent }]}>
                {message}
              </Text>
            ) : null}

            {/* Social login divider */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Social login buttons */}
            <GoogleAuth onError={setError} />
            <AppleAuth onError={setError} />

            {/* Mode switch links */}
            <View style={styles.linksArea}>
              {mode === 'sign-in' && (
                <>
                  <Pressable onPress={() => switchMode('sign-up')}>
                    <Text style={[styles.linkText, { color: colors.tint }]}>
                      Need an account? Sign&nbsp;Up
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => switchMode('magic-link')}>
                    <Text style={[styles.linkText, { color: colors.tint }]}>
                      Use magic link instead
                    </Text>
                  </Pressable>
                </>
              )}
              {mode === 'sign-up' && (
                <Pressable onPress={() => switchMode('sign-in')}>
                  <Text style={[styles.linkText, { color: colors.tint }]}>
                    Already have an account? Sign&nbsp;In
                  </Text>
                </Pressable>
              )}
              {mode === 'magic-link' && (
                <Pressable onPress={() => switchMode('sign-in')}>
                  <Text style={[styles.linkText, { color: colors.tint }]}>
                    Use password instead
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
  },
  appTagline: {
    fontSize: 16,
  },
  formCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 24,
    gap: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  submitButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  errorText: {
    color: '#E63946',
    fontSize: 14,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  linksArea: {
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
