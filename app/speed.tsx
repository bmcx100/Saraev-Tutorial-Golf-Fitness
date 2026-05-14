import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useUser } from '@/contexts/user-context';
import { useHabits } from '@/contexts/habit-context';
import { useColors } from '@/hooks/use-colors';
import { formatDate, loadSpeedSession, saveSpeedSession } from '@/utils/storage';
import {
  STICK_COLORS,
  DRILL_STEPS,
  emptySession,
  type SpeedSession,
  type StickColor,
} from '@/constants/speed-protocols';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { SpeedNumpad } from '@/components/speed-numpad';
import { SpeedInputField } from '@/components/speed-input-field';

// ── Field ordering for tab navigation ─────────────────────────

type FieldId = string; // e.g. 'normalStance.green.dom'

function stickFields(drill: 'normalStance' | 'stepDrill'): FieldId[] {
  const ids: FieldId[] = [];
  for (const s of STICK_COLORS) {
    ids.push(`${drill}.${s.key}.dom`, `${drill}.${s.key}.nonDom`);
  }
  return ids;
}

const FIELDS_BY_STEP: FieldId[][] = [
  stickFields('normalStance'),
  stickFields('stepDrill'),
  ['maxOut.green', 'maxOut.driver'],
];

// ── Helpers ───────────────────────────────────────────────────

function getFieldValue(session: SpeedSession, fieldId: FieldId): number | null {
  const parts = fieldId.split('.');
  if (parts[0] === 'maxOut') {
    return session.maxOut[parts[1] as keyof typeof session.maxOut];
  }
  const drill = parts[0] as 'normalStance' | 'stepDrill';
  const stick = parts[1] as StickColor;
  const side = parts[2] as 'dom' | 'nonDom';
  return session[drill][stick][side];
}

function setFieldValue(session: SpeedSession, fieldId: FieldId, value: number | null): SpeedSession {
  const next = JSON.parse(JSON.stringify(session)) as SpeedSession;
  const parts = fieldId.split('.');
  if (parts[0] === 'maxOut') {
    (next.maxOut as any)[parts[1]] = value;
  } else {
    const drill = parts[0] as 'normalStance' | 'stepDrill';
    const stick = parts[1] as StickColor;
    const side = parts[2] as 'dom' | 'nonDom';
    next[drill][stick][side] = value;
  }
  return next;
}

function hasAnyData(session: SpeedSession): boolean {
  for (const fields of FIELDS_BY_STEP) {
    for (const f of fields) {
      if (getFieldValue(session, f) !== null) return true;
    }
  }
  return false;
}

function allFieldsFilled(session: SpeedSession): boolean {
  for (const fields of FIELDS_BY_STEP) {
    for (const f of fields) {
      if (getFieldValue(session, f) === null) return false;
    }
  }
  return true;
}

function emptyFieldIds(session: SpeedSession): Set<string> {
  const set = new Set<string>();
  for (const fields of FIELDS_BY_STEP) {
    for (const f of fields) {
      if (getFieldValue(session, f) === null) set.add(f);
    }
  }
  return set;
}

// ── Step Tab ─────────────────────────────────────────────────

function StepTab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const colors = useColors();
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(active ? 1 : 0.92, { duration: 200 }) }],
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        style={[
          styles.stepTab,
          {
            backgroundColor: active ? colors.accent : colors.surface,
            borderColor: active ? colors.accent : colors.border,
          },
          animStyle,
        ]}
      >
        <Text
          style={[
            styles.stepTabText,
            {
              color: active ? '#FFFFFF' : colors.textSecondary,
              fontWeight: active ? '700' : '500',
            },
          ]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

// ── Protocol Picker ───────────────────────────────────────────

function ProtocolPicker({ onSelect }: { onSelect: (p: 'superspeed-l1') => void }) {
  const colors = useColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.text }]}>Speed Training</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.pickerContent}>
        <Text style={[styles.pickerTitle, { color: colors.text }]}>
          Choose Your Protocol
        </Text>

        <Pressable
          onPress={() => onSelect('superspeed-l1')}
          style={[styles.protocolCard, { backgroundColor: colors.surface, borderColor: colors.accent }]}
        >
          <MaterialIcons name="bolt" size={28} color={colors.accent} />
          <View style={styles.protocolCardText}>
            <Text style={[styles.protocolName, { color: colors.text }]}>
              Super Speed Sticks L1
            </Text>
            <Text style={[styles.protocolDesc, { color: colors.textSecondary }]}>
              3 weighted sticks, progressive overload
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </Pressable>

        <View
          style={[
            styles.protocolCard,
            { backgroundColor: colors.surface, borderColor: colors.border, opacity: 0.5 },
          ]}
        >
          <MaterialIcons name="speed" size={28} color={colors.textSecondary} />
          <View style={styles.protocolCardText}>
            <Text style={[styles.protocolName, { color: colors.text }]}>
              BMC&apos;s Speedy Sticks{'\u00A0'}of{'\u00A0'}Quickness
            </Text>
            <Text style={[styles.protocolDesc, { color: colors.textSecondary }]}>
              Alternative protocol
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.border }]}>
            <Text style={[styles.badgeText, { color: colors.textSecondary }]}>Coming Soon</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ── Speed Input Wizard ────────────────────────────────────────

function SpeedWizard({ protocol }: { protocol: string }) {
  const colors = useColors();
  const { logHabit } = useHabits();
  const today = formatDate(new Date());

  const [session, setSession] = useState<SpeedSession>(() => emptySession(today, protocol));
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const [step, setStep] = useState(0);
  const [activeField, setActiveField] = useState<FieldId | null>(FIELDS_BY_STEP[0][0]);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  // Load existing session for today
  useEffect(() => {
    (async () => {
      const existing = await loadSpeedSession(today);
      if (existing) setSession(existing);
      setLoaded(true);
    })();
  }, [today]);

  const currentFields = FIELDS_BY_STEP[step];
  const drillInfo = DRILL_STEPS[step];

  const handleDigit = useCallback(
    (d: string) => {
      if (!activeField) return;
      let shouldAdvance = false;
      setSession((prev) => {
        const current = getFieldValue(prev, activeField);
        const currentStr = current !== null ? String(current) : '';
        if (currentStr.length >= 3) return prev; // max 3 digits
        const newStr = currentStr + d;
        if (newStr.length === 3) shouldAdvance = true;
        return setFieldValue(prev, activeField, parseInt(newStr, 10));
      });
      setErrors((prev) => {
        const next = new Set(prev);
        next.delete(activeField);
        return next;
      });
      if (shouldAdvance) {
        const idx = currentFields.indexOf(activeField);
        if (idx < currentFields.length - 1) {
          setActiveField(currentFields[idx + 1]);
        }
      }
    },
    [activeField, currentFields],
  );

  const handleDelete = useCallback(() => {
    if (!activeField) return;
    setSession((prev) => {
      const current = getFieldValue(prev, activeField);
      if (current === null) return prev;
      const str = String(current);
      if (str.length <= 1) return setFieldValue(prev, activeField, null);
      return setFieldValue(prev, activeField, parseInt(str.slice(0, -1), 10));
    });
  }, [activeField]);

  const handleTab = useCallback(() => {
    if (!activeField) {
      setActiveField(currentFields[0]);
      return;
    }
    const idx = currentFields.indexOf(activeField);
    const nextIdx = (idx + 1) % currentFields.length;
    setActiveField(currentFields[nextIdx]);
  }, [activeField, currentFields]);

  const handleBack = useCallback(() => {
    setActiveField(null);
    if (step > 0) {
      setStep(step - 1);
    } else {
      if (hasAnyData(sessionRef.current)) {
        setShowDiscard(true);
      } else {
        router.back();
      }
    }
  }, [step]);

  const handleNext = useCallback(() => {
    const nextStep = step + 1;
    setStep(nextStep);
    setActiveField(FIELDS_BY_STEP[nextStep][0]);
  }, [step]);

  const handleSubmit = useCallback(async () => {
    const current = sessionRef.current;
    if (!allFieldsFilled(current)) {
      setErrors(emptyFieldIds(current));
      setActiveField(null);
      return;
    }
    const final: SpeedSession = { ...current, completedAt: new Date().toISOString() };
    await saveSpeedSession(final);
    logHabit('speed-sticks');
    router.back();
  }, [logHabit]);

  const isLastStep = step === 2;

  if (!loaded) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.topBar}>
        <Pressable onPress={handleBack} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.topTitle, { color: colors.text }]}>Speed Training</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Step tabs */}
      <View style={styles.stepTabs}>
        {DRILL_STEPS.map((d, i) => (
          <StepTab
            key={d.key}
            label={d.label}
            active={i === step}
            onPress={() => {
              setStep(i);
              setActiveField(FIELDS_BY_STEP[i][0]);
            }}
          />
        ))}
      </View>

      {/* Form content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.formContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.drillInstruction, { color: colors.textSecondary }]}>
          {drillInfo.instruction}
        </Text>

        {step < 2 ? (
          // Normal Stance / Step Drill — 3 sticks, dom + nonDom each
          STICK_COLORS.map((stick) => {
            const drillKey = DRILL_STEPS[step].key as 'normalStance' | 'stepDrill';
            const domId = `${drillKey}.${stick.key}.dom`;
            const nonDomId = `${drillKey}.${stick.key}.nonDom`;
            return (
              <View key={stick.key} style={styles.stickRow}>
                <View style={styles.stickLabel}>
                  <View style={[styles.colorDot, { backgroundColor: stick.color }]} />
                  <Text style={[styles.stickName, { color: colors.text }]}>{stick.label}</Text>
                </View>
                <View style={styles.fieldsRow}>
                  <SpeedInputField
                    value={getFieldValue(session, domId)}
                    active={activeField === domId}
                    onPress={() => setActiveField(domId)}
                    label="Dom"
                    error={errors.has(domId)}
                  />
                  <SpeedInputField
                    value={getFieldValue(session, nonDomId)}
                    active={activeField === nonDomId}
                    onPress={() => setActiveField(nonDomId)}
                    label="Non-Dom"
                    error={errors.has(nonDomId)}
                  />
                </View>
              </View>
            );
          })
        ) : (
          // Max Out — green + driver
          <>
            <View style={styles.stickRow}>
              <View style={styles.stickLabel}>
                <View style={[styles.colorDot, { backgroundColor: '#22C55E' }]} />
                <Text style={[styles.stickName, { color: colors.text }]}>Green</Text>
              </View>
              <View style={styles.fieldsRow}>
                <SpeedInputField
                  value={getFieldValue(session, 'maxOut.green')}
                  active={activeField === 'maxOut.green'}
                  onPress={() => setActiveField('maxOut.green')}
                  label="Speed"
                  error={errors.has('maxOut.green')}
                />
              </View>
            </View>
            <View style={styles.stickRow}>
              <View style={styles.stickLabel}>
                <MaterialIcons name="golf-course" size={16} color={colors.textSecondary} />
                <Text style={[styles.stickName, { color: colors.text }]}>Driver</Text>
              </View>
              <View style={styles.fieldsRow}>
                <SpeedInputField
                  value={getFieldValue(session, 'maxOut.driver')}
                  active={activeField === 'maxOut.driver'}
                  onPress={() => setActiveField('maxOut.driver')}
                  label="Speed"
                  error={errors.has('maxOut.driver')}
                />
              </View>
            </View>
          </>
        )}

        {errors.size > 0 && (
          <Text style={styles.errorText}>Fill in all fields before submitting</Text>
        )}
      </ScrollView>

      {/* Numpad — always visible */}
      <SpeedNumpad
        onDigit={handleDigit}
        onDelete={handleDelete}
        onTab={handleTab}
      />

      {/* Bottom action */}
      <View style={[styles.bottomBar, { borderTopColor: colors.border }]}>
        <Pressable
          onPress={isLastStep ? handleSubmit : handleNext}
          style={[styles.actionButton, { backgroundColor: colors.accent }]}
        >
          <Text style={styles.actionButtonText}>{isLastStep ? 'Submit' : 'Next'}</Text>
        </Pressable>
      </View>

      {/* Discard confirmation */}
      <Modal visible={showDiscard} transparent animationType="fade">
        <View style={styles.discardOverlay}>
          <View style={[styles.discardCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.discardTitle, { color: colors.text }]}>
              Discard this session?
            </Text>
            <Text style={[styles.discardBody, { color: colors.textSecondary }]}>
              Your entered speeds will be lost.
            </Text>
            <View style={styles.discardActions}>
              <Pressable
                onPress={() => setShowDiscard(false)}
                style={[styles.discardBtn, { borderColor: colors.border }]}
              >
                <Text style={[styles.discardBtnText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowDiscard(false);
                  router.back();
                }}
                style={[styles.discardBtn, { backgroundColor: '#EF4444', borderColor: '#EF4444' }]}
              >
                <Text style={[styles.discardBtnText, { color: '#FFFFFF' }]}>Discard</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ── Main Screen ───────────────────────────────────────────────

export default function SpeedScreen() {
  const { profile, updateProfile } = useUser();

  const handleSelectProtocol = useCallback(
    (protocol: 'superspeed-l1') => {
      updateProfile({ speedProtocol: protocol });
    },
    [updateProfile],
  );

  if (profile.speedProtocol === null) {
    return <ProtocolPicker onSelect={handleSelectProtocol} />;
  }

  return <SpeedWizard protocol={profile.speedProtocol} />;
}

// ── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: 'none',
  } as any,
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  // Protocol picker
  pickerContent: {
    padding: 20,
    gap: 16,
  },
  pickerTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  protocolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  protocolCardText: {
    flex: 1,
    gap: 2,
  },
  protocolName: {
    fontSize: 16,
    fontWeight: '700',
  },
  protocolDesc: {
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  // Wizard
  stepTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  stepTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  stepTabText: {
    fontSize: 15,
  },
  formContent: {
    padding: 20,
    paddingBottom: 16,
    gap: 16,
  },
  drillInstruction: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  stickRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  stickLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 80,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stickName: {
    fontSize: 15,
    fontWeight: '600',
  },
  fieldsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  discardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  discardCard: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    gap: 8,
  },
  discardTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  discardBody: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  discardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  discardBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  discardBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
