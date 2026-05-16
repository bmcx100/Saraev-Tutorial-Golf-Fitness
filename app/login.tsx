import { useState, useRef } from 'react';
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
import Svg, { Rect, Path } from 'react-native-svg';
import * as Linking from 'expo-linking';
import { AuthHero } from '@/components/auth/auth-hero';
import { GoogleAuth } from '@/components/google-auth';
import { AppleAuth } from '@/components/apple-auth';
import { supabase } from '@/lib/supabase';
import { createSessionFromUrl, redirectTo } from '@/contexts/auth-context';
import {
  greenDeep,
  forest,
  citron,
  paper,
  rule,
  clay,
  ink,
  sub,
  FontFamily,
  shadows,
} from '@/constants/design-tokens';

type AuthMode = 'sign-in' | 'sign-up' | 'magic-link';

const HERO_CONFIG: Record<AuthMode, { eyebrow: string; headline: string; subtitle: string }> = {
  'sign-in': {
    eyebrow: 'Welcome back',
    headline: 'Golf Fitness.',
    subtitle: 'Train smarter \u00B7 play\u00A0better.',
  },
  'sign-up': {
    eyebrow: 'Get started',
    headline: 'Golf Fitness.',
    subtitle: 'Your training starts\u00A0here.',
  },
  'magic-link': {
    eyebrow: 'Quick access',
    headline: 'Golf Fitness.',
    subtitle: 'Sign in with a link to\u00A0your\u00A0email.',
  },
};

const CARD_TITLES: Record<AuthMode, string> = {
  'sign-in': 'Sign in',
  'sign-up': 'Create account',
  'magic-link': 'Magic link',
};

const CTA_LABELS: Record<AuthMode, string> = {
  'sign-in': 'Tee it up',
  'sign-up': 'Create account',
  'magic-link': 'Send link',
};

const CARD_META: Record<AuthMode, string> = {
  'sign-in': 'DAY 1 \u00B7 ACTIVE',
  'sign-up': 'NEW PLAYER',
  'magic-link': 'PASSWORDLESS',
};

/* ── Inline field icons ── */
function MailIcon({ color = sub }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={5} width={18} height={14} rx={2} stroke={color} strokeWidth={1.8} />
      <Path d="m3 7 9 6 9-6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LockIcon({ color = sub }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={11} width={14} height={10} rx={2} stroke={color} strokeWidth={1.8} />
      <Path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function LoginScreen() {
  const [mode, setMode] = useState<AuthMode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  // Handle deep links for magic link callback
  const url = Linking.useURL();
  if (url) {
    createSessionFromUrl(url).catch(() => {});
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
    if (signInError) {
      setError('Email or password doesn\u2019t match.');
      setPassword('');
      passwordRef.current?.focus();
    }
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
      setMessage('Check your email to confirm your\u00A0account');
    }
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
      setMessage('Check your email for a sign-in\u00A0link');
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    clearState();
    if (!email.trim()) {
      setError('Enter your email to reset your\u00A0password');
      return;
    }
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage('Check your email for a password reset\u00A0link');
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    if (mode === 'sign-in') handleSignIn();
    else if (mode === 'sign-up') handleSignUp();
    else handleMagicLink();
  };

  const anyLoading = loading || googleLoading;
  const heroConfig = HERO_CONFIG[mode];

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Region 1 - Forest hero band */}
          <AuthHero
            eyebrow={heroConfig.eyebrow}
            headline={heroConfig.headline}
            subtitle={heroConfig.subtitle}
          />

          {/* Region 2 - Form card (overlaps hero by 50pt) */}
          <View style={styles.formCard}>
            {/* Card header */}
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{CARD_TITLES[mode]}</Text>
              <Text style={styles.cardMeta} accessibilityElementsHidden>
                {CARD_META[mode]}
              </Text>
            </View>

            {/* Email field */}
            <View style={styles.fieldGroup}>
              <Text
                style={[styles.fieldLabel, emailFocused && styles.fieldLabelFocused]}
                nativeID="email-label"
              >
                EMAIL
              </Text>
              <View
                style={[
                  styles.fieldInput,
                  emailFocused && styles.fieldInputFocused,
                ]}
              >
                <MailIcon color={emailFocused || email ? ink : sub} />
                <TextInput
                  style={styles.fieldText}
                  placeholder="you@golf.com"
                  placeholderTextColor="#9aa39c"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  returnKeyType={mode === 'magic-link' ? 'go' : 'next'}
                  onSubmitEditing={() => {
                    if (mode === 'magic-link') handleSubmit();
                    else passwordRef.current?.focus();
                  }}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  accessibilityLabelledBy="email-label"
                />
              </View>
            </View>

            {/* Password field */}
            {mode !== 'magic-link' && (
              <View style={styles.fieldGroup}>
                <Text
                  style={[styles.fieldLabel, passwordFocused && styles.fieldLabelFocused]}
                  nativeID="password-label"
                >
                  PASSWORD
                </Text>
                <View
                  style={[
                    styles.fieldInput,
                    passwordFocused && styles.fieldInputFocused,
                  ]}
                >
                  <LockIcon color={passwordFocused || password ? ink : sub} />
                  <TextInput
                    ref={passwordRef}
                    style={[styles.fieldText, { flex: 1 }]}
                    placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                    placeholderTextColor="#9aa39c"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                    textContentType={mode === 'sign-up' ? 'newPassword' : 'password'}
                    returnKeyType="go"
                    onSubmitEditing={handleSubmit}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    accessibilityLabelledBy="password-label"
                  />
                  <Pressable
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    hitSlop={8}
                    style={styles.showHideButton}
                  >
                    <Text style={styles.showHideText}>
                      {passwordVisible ? 'HIDE' : 'SHOW'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* Forgot link (sign-in mode only) */}
            {mode === 'sign-in' && (
              <View style={styles.forgotRow}>
                <Pressable
                  onPress={handleForgotPassword}
                  style={styles.forgotTouchable}
                  accessibilityRole="link"
                >
                  <Text style={styles.forgotText}>Forgot? {'\u2197'}</Text>
                </Pressable>
              </View>
            )}

            {/* Error message (above CTA) */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {message ? <Text style={styles.messageText}>{message}</Text> : null}

            {/* Primary CTA */}
            <Pressable
              onPress={handleSubmit}
              disabled={anyLoading}
              style={({ pressed }) => [
                styles.ctaButton,
                pressed && styles.ctaButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityState={{ busy: loading }}
            >
              {loading ? (
                <ActivityIndicator color={greenDeep} />
              ) : (
                <>
                  <Text style={styles.ctaText}>{CTA_LABELS[mode]}</Text>
                  <Text style={styles.ctaArrow}>{'\u2192'}</Text>
                </>
              )}
            </Pressable>

            {/* OR divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social auth */}
            <GoogleAuth
              onError={setError}
              onLoadingChange={setGoogleLoading}
              disabled={anyLoading}
            />
            <AppleAuth onError={setError} />
          </View>

          {/* Region 3 - Footer */}
          <View style={styles.footer}>
            {mode === 'sign-in' && (
              <>
                <Pressable onPress={() => switchMode('sign-up')} style={styles.footerLink}>
                  <Text style={styles.footerText}>
                    New here?{' '}
                    <Text style={styles.footerLinkHighlight}>Create an{'\u00A0'}account</Text>
                  </Text>
                </Pressable>
                <Pressable onPress={() => switchMode('magic-link')} style={styles.footerLink}>
                  <Text style={styles.magicLinkText}>USE MAGIC LINK {'\u2197'}</Text>
                </Pressable>
              </>
            )}
            {mode === 'sign-up' && (
              <Pressable onPress={() => switchMode('sign-in')} style={styles.footerLink}>
                <Text style={styles.footerText}>
                  Already have an account?{' '}
                  <Text style={styles.footerLinkHighlight}>Sign{'\u00A0'}in</Text>
                </Text>
              </Pressable>
            )}
            {mode === 'magic-link' && (
              <Pressable onPress={() => switchMode('sign-in')} style={styles.footerLink}>
                <Text style={styles.footerText}>
                  Use password instead?{' '}
                  <Text style={styles.footerLinkHighlight}>Sign{'\u00A0'}in</Text>
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: paper,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* ── Form card ── */
  formCard: {
    marginTop: -50,
    marginHorizontal: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: rule,
    borderRadius: 24,
    paddingVertical: 22,
    paddingHorizontal: 20,
    gap: 12,
    ...shadows.formCard,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 19,
    letterSpacing: 19 * -0.02,
    color: greenDeep,
  },
  cardMeta: {
    fontFamily: FontFamily.monoBold,
    fontSize: 10,
    letterSpacing: 10 * 0.2,
    color: sub,
  },

  /* ── Fields ── */
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontFamily: FontFamily.monoBold,
    fontSize: 9.5,
    letterSpacing: 9.5 * 0.22,
    textTransform: 'uppercase',
    color: sub,
  },
  fieldLabelFocused: {
    color: forest,
  },
  fieldInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: rule,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  fieldInputFocused: {
    borderColor: forest,
    borderWidth: 1.5,
  },
  fieldText: {
    flex: 1,
    fontFamily: FontFamily.outfitMedium,
    fontSize: 15,
    letterSpacing: 15 * -0.005,
    color: ink,
    padding: 0,
    outlineStyle: 'none' as any,
  },
  showHideButton: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  showHideText: {
    fontFamily: FontFamily.monoBold,
    fontSize: 10,
    letterSpacing: 10 * 0.15,
    color: forest,
  },

  /* ── Forgot link ── */
  forgotRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotTouchable: {
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  forgotText: {
    fontFamily: FontFamily.monoBold,
    fontSize: 11,
    letterSpacing: 11 * 0.04,
    color: forest,
  },

  /* ── Messages ── */
  errorText: {
    fontFamily: FontFamily.outfitSemiBold,
    fontSize: 13,
    color: clay,
  },
  messageText: {
    fontFamily: FontFamily.outfitSemiBold,
    fontSize: 13,
    color: forest,
  },

  /* ── Primary CTA ── */
  ctaButton: {
    backgroundColor: citron,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.cta,
  },
  ctaButtonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.92,
  },
  ctaText: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 15,
    letterSpacing: 15 * -0.005,
    color: greenDeep,
  },
  ctaArrow: {
    fontFamily: FontFamily.monoBold,
    fontSize: 14,
    color: greenDeep,
  },

  /* ── OR divider ── */
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: rule,
  },
  dividerText: {
    fontFamily: FontFamily.monoSemiBold,
    fontSize: 9.5,
    letterSpacing: 9.5 * 0.32,
    color: '#9aa39c',
  },

  /* ── Footer ── */
  footer: {
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 28,
    alignItems: 'center',
    gap: 8,
    marginTop: 'auto' as unknown as number,
  },
  footerLink: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: FontFamily.outfitSemiBold,
    fontSize: 13,
    color: greenDeep,
  },
  footerLinkHighlight: {
    fontFamily: FontFamily.outfitBold,
    color: clay,
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(204,111,74,0.4)',
  },
  magicLinkText: {
    fontFamily: FontFamily.monoSemiBold,
    fontSize: 10,
    letterSpacing: 10 * 0.24,
    color: 'rgba(29,78,52,0.5)',
  },
});
