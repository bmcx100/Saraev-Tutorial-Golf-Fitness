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
import Svg, { Rect, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { AuthHero } from '@/components/auth/auth-hero';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
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

function LockIcon({ color = sub }: { color?: string }) {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={11} width={14} height={10} rx={2} stroke={color} strokeWidth={1.8} />
      <Path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { clearPasswordRecovery } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [newFocused, setNewFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setMessage('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8\u00A0characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setMessage('Password updated successfully');
    clearPasswordRecovery();
    setTimeout(() => {
      router.replace('/');
    }, 1500);
    setLoading(false);
  };

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
          {/* Forest hero band */}
          <AuthHero
            eyebrow="Reset password"
            headline="New Password."
            subtitle="Choose a new password for your\u00A0account."
          />

          {/* Form card */}
          <View style={styles.formCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Reset password</Text>
              <Text style={styles.cardMeta} accessibilityElementsHidden>
                SECURE
              </Text>
            </View>

            {/* New password */}
            <View style={styles.fieldGroup}>
              <Text
                style={[styles.fieldLabel, newFocused && styles.fieldLabelFocused]}
                nativeID="new-password-label"
              >
                NEW PASSWORD
              </Text>
              <View
                style={[
                  styles.fieldInput,
                  newFocused && styles.fieldInputFocused,
                ]}
              >
                <LockIcon color={newFocused || newPassword ? ink : sub} />
                <TextInput
                  style={[styles.fieldText, { flex: 1 }]}
                  placeholder="At least 8 characters"
                  placeholderTextColor="#9aa39c"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!newPasswordVisible}
                  textContentType="newPassword"
                  returnKeyType="next"
                  onFocus={() => setNewFocused(true)}
                  onBlur={() => setNewFocused(false)}
                  accessibilityLabelledBy="new-password-label"
                />
                <Pressable
                  onPress={() => setNewPasswordVisible(!newPasswordVisible)}
                  hitSlop={8}
                  style={styles.showHideButton}
                >
                  <Text style={styles.showHideText}>
                    {newPasswordVisible ? 'HIDE' : 'SHOW'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Confirm password */}
            <View style={styles.fieldGroup}>
              <Text
                style={[styles.fieldLabel, confirmFocused && styles.fieldLabelFocused]}
                nativeID="confirm-password-label"
              >
                CONFIRM PASSWORD
              </Text>
              <View
                style={[
                  styles.fieldInput,
                  confirmFocused && styles.fieldInputFocused,
                ]}
              >
                <LockIcon color={confirmFocused || confirmPassword ? ink : sub} />
                <TextInput
                  style={[styles.fieldText, { flex: 1 }]}
                  placeholder="Re-enter your password"
                  placeholderTextColor="#9aa39c"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!confirmPasswordVisible}
                  textContentType="newPassword"
                  returnKeyType="go"
                  onSubmitEditing={handleSubmit}
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                  accessibilityLabelledBy="confirm-password-label"
                />
                <Pressable
                  onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                  hitSlop={8}
                  style={styles.showHideButton}
                >
                  <Text style={styles.showHideText}>
                    {confirmPasswordVisible ? 'HIDE' : 'SHOW'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Error / success messages */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {message ? <Text style={styles.messageText}>{message}</Text> : null}

            {/* Primary CTA */}
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
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
                  <Text style={styles.ctaText}>Update password</Text>
                  <Text style={styles.ctaArrow}>{'\u2192'}</Text>
                </>
              )}
            </Pressable>
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
});
