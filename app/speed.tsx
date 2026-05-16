import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/contexts/user-context';
import { useAuth } from '@/contexts/auth-context';
import { useHabits } from '@/contexts/habit-context';
import {
  formatDate,
  loadSpeedSession,
  saveSpeedSession,
  loadSpeedStats,
  saveSpeedStats,
} from '@/utils/storage';
import type { SpeedStats } from '@/utils/storage';
import * as Haptics from 'expo-haptics';
import { Confetti } from '@/components/confetti';
import { playSound } from '@/constants/sounds';
import {
  STICK_COLORS,
  DRILL_STEPS,
  SPEED_FIELD_KEYS,
  emptySession,
  type SpeedSession,
  type StickColor,
} from '@/constants/speed-protocols';
import {
  paper,
  ink,
  forest,
  greenDeep,
  citron,
  rule,
  FontFamily,
} from '@/constants/design-tokens';

import { ForestHero } from '@/components/speed/forest-hero';
import { SectionHeading } from '@/components/speed/section-heading';
import { StickPillar } from '@/components/speed/stick-pillar';
import { DriverPillar } from '@/components/speed/driver-pillar';
import { Keypad } from '@/components/speed/keypad';
import { CTABar } from '@/components/speed/cta-bar';

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

function setFieldValue(
  session: SpeedSession,
  fieldId: FieldId,
  value: number | null,
): SpeedSession {
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

function countFilledInStep(session: SpeedSession, step: number): number {
  let count = 0;
  for (const f of FIELDS_BY_STEP[step]) {
    if (getFieldValue(session, f) !== null) count++;
  }
  return count;
}

// ── Section heading config per drill ──────────────────────────

const DRILL_CONFIG = [
  {
    eyebrow: 'DRILL \u00B7 1 OF 3',
    title: 'Normal Stance.',
    helper: '3 sticks \u00B7 swing 3\u00D7 \u00B7 best wins',
    progressCaption: 'SWINGS',
    totalFields: 6,
  },
  {
    eyebrow: 'DRILL \u00B7 2 OF 3',
    title: 'Step Drill.',
    helper: '3 sticks \u00B7 swing 3\u00D7 \u00B7 best wins',
    progressCaption: 'SWINGS',
    totalFields: 6,
  },
  {
    eyebrow: 'DRILL \u00B7 3 OF 3',
    title: 'Max Out.',
    helper: 'Green stick + driver \u00B7 swing 3\u00D7 max \u00B7 best wins',
    progressCaption: 'READINGS',
    totalFields: 2,
  },
];

// ── Protocol Picker ───────────────────────────────────────────

function ProtocolPicker({ onSelect }: { onSelect: (p: 'superspeed-l1') => void }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: paper }]}>
      <View style={styles.pickerTopBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.pickerBackText}>{'\u2190'}</Text>
        </Pressable>
        <Text style={styles.pickerTopTitle}>Speed Training</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.pickerContent}>
        <Text style={styles.pickerTitle}>Choose Your Protocol</Text>

        <Pressable
          onPress={() => onSelect('superspeed-l1')}
          style={[styles.protocolCard, { borderColor: citron }]}
        >
          <View style={styles.protocolIcon}>
            <Text style={styles.protocolIconText}>{'\u26A1'}</Text>
          </View>
          <View style={styles.protocolCardText}>
            <Text style={styles.protocolName}>
              Super Speed Sticks L1
            </Text>
            <Text style={styles.protocolDesc}>
              3 weighted sticks, progressive overload
            </Text>
          </View>
          <Text style={styles.protocolChevron}>{'\u203A'}</Text>
        </Pressable>

        <View style={[styles.protocolCard, { borderColor: rule, opacity: 0.5 }]}>
          <View style={styles.protocolIcon}>
            <Text style={styles.protocolIconText}>{'\uD83C\uDFCE\uFE0F'}</Text>
          </View>
          <View style={styles.protocolCardText}>
            <Text style={styles.protocolName}>
              BMC&apos;s Speedy Sticks{'\u00A0'}of{'\u00A0'}Quickness
            </Text>
            <Text style={styles.protocolDesc}>Alternative protocol</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Coming Soon</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ── Speed Input Wizard ────────────────────────────────────────

interface SessionPR {
  key: string;
  label: string;
  value: number;
  previousBest: number | null;
}

interface Standout {
  key: string;
  label: string;
  value: number;
  prValue: number;
  gap: number;
}

function SpeedWizard({ protocol }: { protocol: string }) {
  const { logHabit } = useHabits();
  const { user } = useAuth();
  const { profile } = useUser();
  const today = formatDate(new Date());

  const [session, setSession] = useState<SpeedSession>(() => emptySession(today, protocol));
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const [step, setStep] = useState(0);
  const [activeField, setActiveField] = useState<FieldId | null>(FIELDS_BY_STEP[0][0]);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const [sessionNumber, setSessionNumber] = useState(1);
  const [driverPR, setDriverPR] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fieldPRs, setFieldPRs] = useState<Record<string, number>>({});

  // Session summary modal state
  const [showSummary, setShowSummary] = useState(false);
  const [summaryPRs, setSummaryPRs] = useState<SessionPR[]>([]);
  const [summaryStandouts, setSummaryStandouts] = useState<Standout[]>([]);
  const [summaryConfetti, setSummaryConfetti] = useState(false);

  // Load existing session, session count, and PR on mount
  useEffect(() => {
    (async () => {
      const existing = await loadSpeedSession(today);
      if (existing) setSession(existing);

      // Session count
      const allKeys = await AsyncStorage.getAllKeys();
      const sessionCount = allKeys.filter((k) => k.startsWith('speed-session-')).length;
      setSessionNumber(sessionCount + 1);

      // Driver PR + field PRs
      const stats = await loadSpeedStats();
      if (stats?.driverPR) setDriverPR(stats.driverPR.mph);
      if (stats?.fieldPRs) setFieldPRs(stats.fieldPRs);

      setLoaded(true);
    })();
  }, [today]);

  const currentFields = FIELDS_BY_STEP[step];

  const handleDigit = useCallback(
    (d: string) => {
      if (!activeField) return;
      let shouldAdvance = false;
      setSession((prev) => {
        const current = getFieldValue(prev, activeField);
        const currentStr = current !== null ? String(current) : '';
        if (currentStr.length >= 3) return prev;
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

  const handleNext = useCallback(() => {
    if (!activeField) {
      setActiveField(currentFields[0]);
      return;
    }
    const idx = currentFields.indexOf(activeField);
    if (idx < currentFields.length - 1) {
      setActiveField(currentFields[idx + 1]);
    }
    // After last field in drill, NEXT does nothing
  }, [activeField, currentFields]);

  const handleBack = useCallback(() => {
    if (hasAnyData(sessionRef.current)) {
      setShowDiscard(true);
    } else {
      router.back();
    }
  }, []);

  const handleTabChange = useCallback((index: number) => {
    setStep(index);
    setActiveField(FIELDS_BY_STEP[index][0]);
    setErrors(new Set());
  }, []);

  const handleSubmit = useCallback(async () => {
    const current = sessionRef.current;
    if (!allFieldsFilled(current)) {
      setErrors(emptyFieldIds(current));
      setActiveField(null);
      return;
    }
    setSubmitting(true);
    const final: SpeedSession = { ...current, completedAt: new Date().toISOString() };
    await saveSpeedSession(final, user?.id);

    // Update speed aggregate stats
    const stats: SpeedStats = (await loadSpeedStats()) ?? {
      driverPR: null,
      previousDriverPR: null,
      lastSessionDate: null,
      fieldPRs: {},
    };
    if (!stats.fieldPRs) stats.fieldPRs = {};

    // Track all 14 field PRs
    const sessionPRList: SessionPR[] = [];
    const standoutList: Standout[] = [];

    for (const { key, label } of SPEED_FIELD_KEYS) {
      const val = getFieldValue(final, key);
      if (val == null) continue;
      const storedPR = stats.fieldPRs[key];
      if (storedPR == null || val > storedPR) {
        sessionPRList.push({
          key,
          label,
          value: val,
          previousBest: storedPR ?? null,
        });
        stats.fieldPRs[key] = val;
      } else if (storedPR - val <= 3 && storedPR - val > 0) {
        standoutList.push({
          key,
          label,
          value: val,
          prValue: storedPR,
          gap: storedPR - val,
        });
      }
    }

    // Driver PR logic (existing)
    if (final.maxOut.driver != null) {
      if (!stats.driverPR || final.maxOut.driver > stats.driverPR.mph) {
        stats.previousDriverPR = stats.driverPR;
        stats.driverPR = { mph: final.maxOut.driver, date: today };
      }
    }
    stats.lastSessionDate = today;
    await saveSpeedStats(stats, user?.id);

    logHabit('speed-training');

    // Show session summary modal if PRs or standouts exist
    if (sessionPRList.length > 0 || standoutList.length > 0) {
      setSummaryPRs(sessionPRList);
      setSummaryStandouts(standoutList);

      const hasMaxOutPR = sessionPRList.some(
        (pr) => pr.key === 'maxOut.driver' || pr.key === 'maxOut.green',
      );
      setSummaryConfetti(hasMaxOutPR);

      if (hasMaxOutPR) {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
        playSound('confetti', profile.soundEnabled);
      } else {
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        playSound('success', profile.soundEnabled);
      }

      setShowSummary(true);
    } else {
      router.back();
    }
  }, [logHabit, today, user?.id, profile.soundEnabled]);

  // CTA helpers
  const focusedValue = activeField ? getFieldValue(session, activeField) : null;
  const isMaxOut = step === 2;

  const handleCTAPress = useCallback(() => {
    if (isMaxOut) {
      handleSubmit();
    } else {
      // Advance to next empty cell in current drill, or next tab
      const filled = countFilledInStep(sessionRef.current, step);
      if (filled >= DRILL_CONFIG[step].totalFields) {
        // All filled in this drill — advance to next tab
        const nextStep = step + 1;
        setStep(nextStep);
        setActiveField(FIELDS_BY_STEP[nextStep][0]);
        setErrors(new Set());
      } else if (activeField) {
        // Advance to next field
        const idx = currentFields.indexOf(activeField);
        if (idx < currentFields.length - 1) {
          setActiveField(currentFields[idx + 1]);
        }
      }
    }
  }, [isMaxOut, handleSubmit, step, activeField, currentFields]);

  const ctaLabel = isMaxOut
    ? `Submit ${focusedValue ?? ''} mph`
    : `Log ${focusedValue ?? ''} mph`;
  const ctaGlyph = isMaxOut ? '\u2713' : '\u2192';

  // Determine which stick is active (has the focused field)
  function getActiveStick(): StickColor | null {
    if (!activeField) return null;
    const parts = activeField.split('.');
    if (parts[0] === 'maxOut') return null;
    return parts[1] as StickColor;
  }

  const filledCount = countFilledInStep(session, step);
  const config = DRILL_CONFIG[step];

  if (!loaded) return null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ForestHero
        activeTab={step as 0 | 1 | 2}
        onTabChange={handleTabChange}
        sessionNumber={sessionNumber}
        prValue={driverPR}
        prCaption={isMaxOut ? 'DRIVER PR' : 'PR \u00B7 MPH'}
        onBack={handleBack}
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: paper }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SectionHeading
          eyebrow={config.eyebrow}
          title={config.title}
          helper={config.helper}
          progressNum={`${filledCount} / ${config.totalFields}`}
          progressCaption={config.progressCaption}
        />

        {step < 2 ? (
          // Normal Stance / Step Drill — 3 stick pillars
          <View style={styles.pillarsRow}>
            {STICK_COLORS.map((stick, i) => {
              const drillKey = DRILL_STEPS[step].key as 'normalStance' | 'stepDrill';
              const domId = `${drillKey}.${stick.key}.dom`;
              const nonDomId = `${drillKey}.${stick.key}.nonDom`;
              const isActive = getActiveStick() === stick.key;

              return (
                <StickPillar
                  key={stick.key}
                  stick={stick.key}
                  active={isActive}
                  domValue={getFieldValue(session, domId)}
                  nonDomValue={getFieldValue(session, nonDomId)}
                  focusedCell={
                    activeField === domId
                      ? 'dom'
                      : activeField === nonDomId
                        ? 'nonDom'
                        : null
                  }
                  onCellPress={(cell) => {
                    setActiveField(cell === 'dom' ? domId : nonDomId);
                  }}
                  animDelay={i * 60}
                  domPR={fieldPRs[domId]}
                  nonDomPR={fieldPRs[nonDomId]}
                />
              );
            })}
          </View>
        ) : (
          // Max Out — green stick + driver
          <View style={styles.pillarsRowMaxOut}>
            <StickPillar
              variant="maxOut"
              stick="green"
              active={activeField === 'maxOut.green'}
              value={getFieldValue(session, 'maxOut.green')}
              focused={activeField === 'maxOut.green'}
              onCellPress={() => setActiveField('maxOut.green')}
              animDelay={0}
              prValue={fieldPRs['maxOut.green']}
            />
            <DriverPillar
              active={activeField === 'maxOut.driver'}
              value={getFieldValue(session, 'maxOut.driver')}
              focused={activeField === 'maxOut.driver'}
              onCellPress={() => setActiveField('maxOut.driver')}
              animDelay={60}
              prValue={fieldPRs['maxOut.driver']}
            />
          </View>
        )}

        {errors.size > 0 && (
          <Text style={styles.errorText}>Fill in all fields before submitting</Text>
        )}
      </ScrollView>

      <Keypad
        onDigit={handleDigit}
        onDelete={handleDelete}
        onNext={handleNext}
      />

      <CTABar
        label={ctaLabel}
        glyph={ctaGlyph}
        onPress={handleCTAPress}
        loading={submitting}
      />

      {/* Discard confirmation modal */}
      <Modal visible={showDiscard} transparent animationType="fade">
        <View style={styles.discardOverlay}>
          <View style={styles.discardCard}>
            <Text style={styles.discardTitle}>
              Discard this session?
            </Text>
            <Text style={styles.discardBody}>
              Your entered speeds will be lost.
            </Text>
            <View style={styles.discardActions}>
              <Pressable
                onPress={() => setShowDiscard(false)}
                style={[styles.discardBtn, styles.discardBtnCancel]}
              >
                <Text style={styles.discardBtnCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setShowDiscard(false);
                  router.back();
                }}
                style={[styles.discardBtn, styles.discardBtnDiscard]}
              >
                <Text style={styles.discardBtnDiscardText}>Discard</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Session Summary Modal */}
      <Modal visible={showSummary} transparent animationType="fade">
        <View style={summaryStyles.overlay}>
          {summaryConfetti && (
            <Confetti active={summaryConfetti} particleCount={60} />
          )}
          <View style={summaryStyles.card}>
            {summaryConfetti ? (
              <>
                {summaryPRs
                  .filter((pr) => pr.key === 'maxOut.driver' || pr.key === 'maxOut.green')
                  .map((pr) => (
                    <View key={pr.key} style={summaryStyles.heroBlock}>
                      <Text style={summaryStyles.heroNumber}>{pr.value}</Text>
                      <Text style={summaryStyles.heroLabel}>
                        {pr.key === 'maxOut.driver' ? 'New Driver PR' : 'New Green Stick PR'}
                      </Text>
                      {pr.previousBest != null && (
                        <Text style={summaryStyles.heroDelta}>
                          {'\u2191'} {pr.value - pr.previousBest} mph
                        </Text>
                      )}
                    </View>
                  ))}
              </>
            ) : (
              <View style={summaryStyles.headerBar}>
                <Text style={summaryStyles.headerText}>Session Highlights</Text>
              </View>
            )}

            {/* Other PRs */}
            {summaryPRs
              .filter((pr) => !(summaryConfetti && (pr.key === 'maxOut.driver' || pr.key === 'maxOut.green')))
              .map((pr) => (
                <View key={pr.key} style={summaryStyles.prRow}>
                  <Text style={summaryStyles.prLabel}>{pr.label}</Text>
                  <Text style={summaryStyles.prValue}>{pr.value} mph</Text>
                  {pr.previousBest != null && (
                    <Text style={summaryStyles.prDelta}>
                      {'\u2191'} {pr.value - pr.previousBest}
                    </Text>
                  )}
                  {pr.previousBest == null && (
                    <Text style={summaryStyles.prBadge}>NEW PR</Text>
                  )}
                </View>
              ))}

            {/* Standouts */}
            {summaryStandouts.map((s) => (
              <View key={s.key} style={summaryStyles.standoutRow}>
                <Text style={summaryStyles.standoutLabel}>{s.label}</Text>
                <Text style={summaryStyles.standoutValue}>
                  {s.value} mph {'\u2014'} {s.gap} mph from PR
                </Text>
              </View>
            ))}

            <Pressable
              onPress={() => {
                setShowSummary(false);
                router.back();
              }}
              style={summaryStyles.continueBtn}
            >
              <Text style={summaryStyles.continueBtnText}>Continue</Text>
            </Pressable>
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
    backgroundColor: paper,
    userSelect: 'none',
  } as any,
  // Protocol picker
  pickerTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  pickerBackText: {
    fontSize: 24,
    color: ink,
    fontFamily: FontFamily.outfitBold,
  },
  pickerTopTitle: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 17,
    color: ink,
  },
  pickerContent: {
    padding: 20,
    gap: 16,
  },
  pickerTitle: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 24,
    color: ink,
    marginBottom: 8,
  },
  protocolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    backgroundColor: '#fff',
  },
  protocolIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  protocolIconText: {
    fontSize: 20,
  },
  protocolCardText: {
    flex: 1,
    gap: 2,
  },
  protocolName: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 16,
    color: ink,
  },
  protocolDesc: {
    fontFamily: FontFamily.outfitMedium,
    fontSize: 13,
    color: '#6b756f',
  },
  protocolChevron: {
    fontSize: 24,
    color: '#6b756f',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: rule,
  },
  badgeText: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 11,
    color: '#6b756f',
  },
  // Wizard pillars
  pillarsRow: {
    padding: 8,
    paddingHorizontal: 14,
    paddingBottom: 18,
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },
  pillarsRowMaxOut: {
    padding: 8,
    paddingHorizontal: 16,
    paddingBottom: 20,
    flex: 1,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'stretch',
  },
  errorText: {
    fontFamily: FontFamily.outfitMedium,
    color: '#cc6f4a',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    paddingBottom: 8,
  },
  // Discard modal — Subpar v3
  discardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  discardCard: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    gap: 8,
    backgroundColor: paper,
    shadowColor: '#11371f',
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.18,
    shadowRadius: 40,
    elevation: 8,
  },
  discardTitle: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 17,
    color: ink,
    textAlign: 'center',
  },
  discardBody: {
    fontFamily: FontFamily.outfitMedium,
    fontSize: 14,
    color: '#6b756f',
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
    borderRadius: 12,
    alignItems: 'center',
  },
  discardBtnCancel: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: rule,
  },
  discardBtnCancelText: {
    fontFamily: FontFamily.outfitSemiBold,
    fontSize: 15,
    color: forest,
  },
  discardBtnDiscard: {
    backgroundColor: citron,
  },
  discardBtnDiscardText: {
    fontFamily: FontFamily.outfitSemiBold,
    fontSize: 15,
    color: greenDeep,
  },
});

const summaryStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    gap: 12,
    backgroundColor: paper,
    shadowColor: '#11371f',
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.18,
    shadowRadius: 40,
    elevation: 8,
  },
  heroBlock: {
    alignItems: 'center',
    marginBottom: 4,
  },
  heroNumber: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 64,
    color: ink,
    letterSpacing: -2,
  },
  heroLabel: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 17,
    color: ink,
  },
  heroDelta: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 15,
    color: citron,
    marginTop: 2,
  },
  headerBar: {
    backgroundColor: citron,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  headerText: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 15,
    color: greenDeep,
    textAlign: 'center',
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  prLabel: {
    fontFamily: FontFamily.outfitSemiBold,
    fontSize: 13,
    color: ink,
    flex: 1,
  },
  prValue: {
    fontFamily: FontFamily.monoBold,
    fontSize: 13,
    color: greenDeep,
  },
  prDelta: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 12,
    color: citron,
  },
  prBadge: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 10,
    color: citron,
    letterSpacing: 1,
  },
  standoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 3,
    opacity: 0.8,
  },
  standoutLabel: {
    fontFamily: FontFamily.outfitMedium,
    fontSize: 12,
    color: '#6b756f',
    flex: 1,
  },
  standoutValue: {
    fontFamily: FontFamily.outfitMedium,
    fontSize: 12,
    color: '#6b756f',
  },
  continueBtn: {
    backgroundColor: citron,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  continueBtnText: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 15,
    color: greenDeep,
  },
});
