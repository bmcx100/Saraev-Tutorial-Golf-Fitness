import { useState } from 'react';
import { ScrollView, View, Text, Pressable, Alert, Modal, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { HABIT_LIBRARY, CATEGORY_META, type Habit, type HabitCategory } from '@/constants/habits';
import { useUser, type ScheduleConfig, type HabitGoalConfig } from '@/contexts/user-context';
import { useHabits } from '@/contexts/habit-context';
import { clearAllData, generateStreakData, saveLogs, formatDate, rebuildStatsAggregates } from '@/utils/storage';
import { scheduleDaily } from '@/utils/notifications';
import { WeekdayPicker } from '@/components/weekday-picker';
import { Confetti } from '@/components/confetti';
import { getGoalWeekdays } from '@/utils/schedule';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/lib/supabase';
import { SPColors } from '@/constants/theme';
import {
  ArrowBackIcon, SlidersIcon, TargetIcon, BellIcon, SunIcon, PersonIcon, TerminalIcon,
  GearIcon, CheckIcon,
  BoltLineIcon, DriverIcon, PuttIcon, RunnerIcon, CardioLineIcon, CoreIcon,
  MealIcon, WaterIcon, CocktailIcon, MoonIcon,
  ConfettiIcon, ChecksIcon, TrophyIcon, ChartLineIcon, BarChartIcon,
  ResetIcon, TrashIcon, SignOutIcon,
} from '@/components/ui/design-icons';

const { ink, sub, greenDeep, citron, cream, paper, rule, clay, toggleOn, toggleOff, dayBtnBg, dayBtnFg } = SPColors;

type SectionId = 'tracking' | 'notifications' | 'preferences' | 'account' | 'dev' | 'none';

// ─── Map habit id → row icon component ──────────────────────────
const HABIT_ICON_MAP: Record<string, React.FC<{ size?: number; color?: string }>> = {
  'speed-training': BoltLineIcon,
  driver: DriverIcon,
  putt: PuttIcon,
  gym: RunnerIcon,
  cardio: CardioLineIcon,
  core: CoreIcon,
  meals: MealIcon,
  h2o: WaterIcon,
  alcohol: CocktailIcon,
  sleep: MoonIcon,
};

// ─── Section icon for expanded header tile ──────────────────────
const SECTION_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
  tracking: TargetIcon,
  notifications: BellIcon,
  preferences: SunIcon,
  account: PersonIcon,
  dev: TerminalIcon,
};

// ─── Section header (collapsed / expanded) ──────────────────────
function SectionHeader({ label, sectionId, open, accent }: {
  label: string; sectionId: string; open: boolean; accent?: string;
}) {
  const labelColor = accent ?? (open ? greenDeep : sub);
  const IconComp = SECTION_ICONS[sectionId];

  if (!open) {
    return (
      <View style={s.headerCollapsed}>
        <Text style={[s.headerLabel, { color: labelColor }]}>{label}</Text>
        <SlidersIcon size={15} color={labelColor} />
      </View>
    );
  }

  const tileBg = accent ?? greenDeep;
  const tileGlyph = accent ? cream : citron;

  return (
    <View style={s.headerExpanded}>
      <View style={[s.iconTile, { backgroundColor: tileBg }]}>
        {IconComp && <IconComp size={16} color={tileGlyph} />}
      </View>
      <Text style={[s.headerLabel, { color: labelColor, flex: 1 }]}>{label}</Text>
      <SlidersIcon size={15} color={sub} />
    </View>
  );
}

// ─── Section wrapper ────────────────────────────────────────────
function Section({ label, sectionId, open, accent, onToggle, children }: {
  label: string; sectionId: string; open: boolean; accent?: string;
  onToggle: () => void; children?: React.ReactNode;
}) {
  const isDevTools = !!accent;
  return (
    <View style={[
      s.section,
      {
        backgroundColor: open ? '#fff' : paper,
        borderColor: isDevTools && !open ? accent : rule,
      },
      open && s.sectionOpen,
    ]}>
      <Pressable onPress={onToggle}>
        <SectionHeader label={label} sectionId={sectionId} open={open} accent={accent} />
      </Pressable>
      {open && <View style={s.sectionBody}>{children}</View>}
    </View>
  );
}

// ─── Toggle (custom to match spec) ──────────────────────────────
function SpecToggle({ on, onValueChange }: { on: boolean; onValueChange: (v: boolean) => void }) {
  return (
    <Pressable onPress={() => onValueChange(!on)} style={[s.toggle, { backgroundColor: on ? toggleOn : toggleOff }]}>
      <View style={[s.toggleKnob, { left: on ? 20 : 2 }]} />
    </Pressable>
  );
}

// ─── Toggle row ─────────────────────────────────────────────────
function ToggleRow({ label, on, onValueChange, last }: {
  label: string; on: boolean; onValueChange: (v: boolean) => void; last?: boolean;
}) {
  return (
    <View style={[s.kvRow, !last && s.rowBorder]}>
      <Text style={s.rowLabel}>{label}</Text>
      <SpecToggle on={on} onValueChange={onValueChange} />
    </View>
  );
}

// ─── KV row ─────────────────────────────────────────────────────
function KVRow({ label, value, last, onPress }: {
  label: string; value: string; last?: boolean; onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[s.kvRow, !last && s.rowBorder]}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.kvValue}>{value}</Text>
    </Pressable>
  );
}

// ─── Tracking row ───────────────────────────────────────────────
function TrackingRow({ habit, on, last, onToggle, onGear }: {
  habit: Habit; on: boolean; last?: boolean;
  onToggle: () => void; onGear: () => void;
}) {
  const IconComp = HABIT_ICON_MAP[habit.id];
  return (
    <Pressable onPress={onToggle} style={[s.trackingRow, !last && s.rowBorder]}>
      {IconComp ? <IconComp size={18} color={ink} /> : <View style={{ width: 18, height: 18 }} />}
      <Text style={[s.rowLabel, { flex: 1 }]}>{habit.name}</Text>
      <Pressable onPress={(e) => { e.stopPropagation(); onGear(); }} hitSlop={8}>
        <GearIcon size={15} color={sub} />
      </Pressable>
      <View style={[s.selector, on && s.selectorOn]}>
        {on && <CheckIcon size={11} color="#fff" />}
      </View>
    </Pressable>
  );
}

// ─── Tracking group ─────────────────────────────────────────────
function TrackingGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <Text style={s.groupHeader}>{title}</Text>
      {children}
    </View>
  );
}

// ─── Dev row ────────────────────────────────────────────────────
function DevRow({ icon: IconComp, label, last, onPress }: {
  icon: React.FC<{ size?: number; color?: string }>;
  label: string; last?: boolean; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[s.devRow, !last && s.rowBorder]}>
      <IconComp size={18} color={ink} />
      <Text style={[s.rowLabel, { flex: 1 }]}>{label}</Text>
    </Pressable>
  );
}

// ─── Danger button ──────────────────────────────────────────────
function DangerBtn({ icon: IconComp, label, onPress }: {
  icon: React.FC<{ size?: number; color?: string }>;
  label: string; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={s.dangerBtn}>
      <IconComp size={16} color={clay} />
      <Text style={s.dangerBtnText}>{label}</Text>
    </Pressable>
  );
}

// ═══════════════════════════════════════════════════════════════
// Settings Screen
// ═══════════════════════════════════════════════════════════════

export default function SettingsScreen() {
  const { profile, updateProfile, devDateOverride, setDevDateOverride, resetProfile } = useUser();
  const [detailHabit, setDetailHabit] = useState<Habit | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [expanded, setExpanded] = useState<SectionId>('none');
  const { todayHabits, logHabit } = useHabits();
  const { user } = useAuth();

  const toggle = (id: SectionId) => setExpanded((prev) => (prev === id ? 'none' : id));

  const toggleHabit = (id: string) => {
    const ids = profile.activeHabitIds.includes(id)
      ? profile.activeHabitIds.filter((h) => h !== id)
      : [...profile.activeHabitIds, id];
    updateProfile({ activeHabitIds: ids });
  };

  const toggleNotifications = (val: boolean) => {
    updateProfile({ notificationsEnabled: val });
    scheduleDaily(
      profile.notificationMorning,
      profile.notificationEvening,
      profile.activeHabitIds.length,
      val,
    );
  };

  const toggleSound = (val: boolean) => {
    updateProfile({ soundEnabled: val });
  };

  const confirmSignOut = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to sign out?')) {
        supabase.auth.signOut();
      }
    } else {
      Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => supabase.auth.signOut() },
      ]);
    }
  };

  const confirmResetToday = async () => {
    const doReset = async () => {
      const today = devDateOverride ?? formatDate(new Date());
      await saveLogs(today, []);
      if (Platform.OS === 'web') {
        window.alert("Today's progress has been reset. Go back and return to refresh.");
      } else {
        Alert.alert('Done', "Today's progress has been reset. Go back and return to refresh.");
      }
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Clear all habit progress for today?')) await doReset();
    } else {
      Alert.alert('Reset Today', 'Clear all habit progress for today?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: doReset },
      ]);
    }
  };

  const confirmClearAll = async () => {
    const doClear = async () => {
      await clearAllData();
      resetProfile();
    };
    if (Platform.OS === 'web') {
      if (window.confirm('This will delete ALL app data and return to onboarding. Are you sure?')) await doClear();
    } else {
      Alert.alert('Clear All Data', 'This will delete ALL app data and return to onboarding. Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete Everything', style: 'destructive', onPress: doClear },
      ]);
    }
  };

  const schedule = profile.schedule;

  return (
    <SafeAreaView style={s.container}>
      <Confetti active={confettiActive} onComplete={() => setConfettiActive(false)} />

      {/* Top bar */}
      <View style={s.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={s.backBtn}>
          <ArrowBackIcon size={18} color={ink} />
        </Pressable>
        <Text style={s.topTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Hint */}
      <Text style={s.hint}>Expand a topic to edit{'\u00A0'}settings</Text>

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Tracking ── */}
        <Section label="TRACKING" sectionId="tracking" open={expanded === 'tracking'} onToggle={() => toggle('tracking')}>
          {(['golf', 'workout', 'lifestyle'] as HabitCategory[]).map((cat) => {
            const habits = HABIT_LIBRARY.filter((h) => h.category === cat);
            if (habits.length === 0) return null;
            return (
              <TrackingGroup key={cat} title={CATEGORY_META[cat].label}>
                {habits.map((habit, i) => (
                  <TrackingRow
                    key={habit.id}
                    habit={habit}
                    on={profile.activeHabitIds.includes(habit.id)}
                    last={i === habits.length - 1}
                    onToggle={() => toggleHabit(habit.id)}
                    onGear={() => setDetailHabit(habit)}
                  />
                ))}
              </TrackingGroup>
            );
          })}
        </Section>

        {/* ── Notifications ── */}
        <Section label="NOTIFICATIONS" sectionId="notifications" open={expanded === 'notifications'} onToggle={() => toggle('notifications')}>
          <ToggleRow label="Enable notifications" on={profile.notificationsEnabled} onValueChange={toggleNotifications} />
          <KVRow label="Morning reminder" value={profile.notificationMorning} />
          <KVRow label="Evening check-in" value={profile.notificationEvening} last />
        </Section>

        {/* ── Preferences ── */}
        <Section label="PREFERENCES" sectionId="preferences" open={expanded === 'preferences'} onToggle={() => toggle('preferences')}>
          <ToggleRow label="Sound effects" on={profile.soundEnabled} onValueChange={toggleSound} last />
        </Section>

        {/* ── Account ── */}
        <Section label="ACCOUNT" sectionId="account" open={expanded === 'account'} onToggle={() => toggle('account')}>
          <Text style={s.emailText}>{user?.email ?? 'Not signed in'}</Text>
          <DangerBtn icon={SignOutIcon} label="Sign Out" onPress={confirmSignOut} />
        </Section>

        {/* ── Dev Tools ── */}
        {__DEV__ && (
          <Section label="DEV TOOLS" sectionId="dev" open={expanded === 'dev'} accent={clay} onToggle={() => toggle('dev')}>
            <DevRow icon={ConfettiIcon} label="Test Confetti" onPress={() => setConfettiActive(true)} />
            <DevRow icon={ChecksIcon} label="Complete All Today's Habits" onPress={() => todayHabits.forEach((h) => logHabit(h.id))} />
            <DevRow icon={TrophyIcon} label="Force Complete Challenge" onPress={() => {
              Alert.alert('Note', 'Navigate to the challenge and complete manually, or generate streak data to trigger completion.');
            }} />

            {/* Day stepper */}
            <View style={s.dayStepperRow}>
              <Pressable
                onPress={() => {
                  const current = devDateOverride ? new Date(devDateOverride + 'T00:00:00') : new Date();
                  current.setDate(current.getDate() - 1);
                  setDevDateOverride(formatDate(current));
                }}
                style={s.dayStepperBtn}
              >
                <Text style={s.dayStepperBtnText}>{'\u2212'}{'\u00A0'}Day</Text>
              </Pressable>
              <Text style={s.dayStepperLabel}>{devDateOverride ?? 'Today'}</Text>
              <Pressable
                onPress={() => {
                  const current = devDateOverride ? new Date(devDateOverride + 'T00:00:00') : new Date();
                  current.setDate(current.getDate() + 1);
                  setDevDateOverride(formatDate(current));
                }}
                style={s.dayStepperBtn}
              >
                <Text style={s.dayStepperBtnText}>+{'\u00A0'}Day</Text>
              </Pressable>
            </View>

            {/* Divider */}
            <View style={s.devDivider} />

            <DevRow icon={ChartLineIcon} label="Generate 7-Day Streak" onPress={async () => {
              const days = await generateStreakData(profile.activeHabitIds, 7, devDateOverride ?? undefined);
              Alert.alert('Done', `Generated ${days} days of streak data.`);
            }} />
            <DevRow icon={ChartLineIcon} label="Generate 30-Day Streak" onPress={async () => {
              const days = await generateStreakData(profile.activeHabitIds, 30, devDateOverride ?? undefined);
              Alert.alert('Done', `Generated ${days} days of streak data.`);
            }} />
            <DevRow icon={BarChartIcon} label="Rebuild Stats" last onPress={async () => {
              await rebuildStatsAggregates(user?.id);
              if (Platform.OS === 'web') {
                window.alert('Stats aggregates rebuilt from all session data.');
              } else {
                Alert.alert('Done', 'Stats aggregates rebuilt from all session data.');
              }
            }} />

            {/* DATA subhead */}
            <Text style={s.dataSubhead}>DATA</Text>

            <View style={{ gap: 10 }}>
              <DangerBtn icon={ResetIcon} label="Reset Today's Progress" onPress={confirmResetToday} />
              <DangerBtn icon={TrashIcon} label="Clear All Data" onPress={confirmClearAll} />
            </View>
          </Section>
        )}
      </ScrollView>

      {/* Habit Detail Modal (unchanged) */}
      <Modal
        visible={detailHabit !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setDetailHabit(null)}
      >
        {detailHabit && (
          <HabitDetailPanel
            habit={detailHabit}
            schedule={schedule}
            onUpdateSchedule={(newSchedule) => updateProfile({ schedule: newSchedule })}
            onClose={() => setDetailHabit(null)}
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════
// HabitDetailPanel (preserved from original)
// ═══════════════════════════════════════════════════════════════

const PERIODS: HabitGoalConfig['period'][] = ['daily', 'weekly', 'monthly'];

function HabitDetailPanel({
  habit, schedule, onUpdateSchedule, onClose,
}: {
  habit: Habit; schedule: ScheduleConfig;
  onUpdateSchedule: (schedule: ScheduleConfig) => void; onClose: () => void;
}) {
  const { profile, updateProfile } = useUser();
  const currentMode = schedule.habitModes?.[habit.id] ?? 'weekdays';
  const currentGoal = schedule.habitGoals?.[habit.id] ?? { count: 3, period: 'weekly' as const };

  const [mode, setMode] = useState<'weekdays' | 'goal'>(currentMode);
  const [goalCount, setGoalCount] = useState(currentGoal.count);
  const [goalPeriod, setGoalPeriod] = useState<HabitGoalConfig['period']>(currentGoal.period);
  const [showProtocolPicker, setShowProtocolPicker] = useState(false);

  const previewDays = getGoalWeekdays({ count: goalCount, period: goalPeriod });

  const saveMode = (
    newMode: 'weekdays' | 'goal', newCount?: number, newPeriod?: HabitGoalConfig['period'],
  ) => {
    const count = newCount ?? goalCount;
    const period = newPeriod ?? goalPeriod;
    const next = { ...schedule };
    next.habitModes = { ...next.habitModes, [habit.id]: newMode };
    if (newMode === 'goal') {
      next.habitGoals = { ...next.habitGoals, [habit.id]: { count, period } };
      next.habitWeekdays = { ...next.habitWeekdays, [habit.id]: getGoalWeekdays({ count, period }) };
    } else {
      const { [habit.id]: _, ...restGoals } = next.habitGoals ?? {};
      next.habitGoals = restGoals;
    }
    onUpdateSchedule(next);
  };

  const handleModeChange = (newMode: 'weekdays' | 'goal') => { setMode(newMode); saveMode(newMode); };
  const handleCountChange = (delta: number) => {
    const next = Math.max(1, Math.min(31, goalCount + delta));
    setGoalCount(next); saveMode('goal', next, goalPeriod);
  };
  const handlePeriodChange = (p: HabitGoalConfig['period']) => { setGoalPeriod(p); saveMode('goal', goalCount, p); };
  const handleWeekdayChange = (days: number[]) => {
    onUpdateSchedule({ ...schedule, habitWeekdays: { ...schedule.habitWeekdays, [habit.id]: days } });
  };

  const protocolLabel = profile.speedProtocol === 'superspeed-l1'
    ? 'Super Speed Sticks L1'
    : profile.speedProtocol === 'bmc'
      ? "BMC's Speedy Sticks of Quickness"
      : 'Not set';

  return (
    <SafeAreaView style={[dp.container, { backgroundColor: '#fff' }]}>
      <View style={dp.topBar}>
        <View style={{ width: 24 }} />
        <Text style={dp.topTitle}>{habit.name}</Text>
        <Pressable onPress={onClose} hitSlop={12}>
          <MaterialIcons name="close" size={24} color={ink} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={dp.content} showsVerticalScrollIndicator={false}>
        <View style={dp.detailHeader}>
          <View style={[dp.detailIconWrap, { backgroundColor: habit.ringColor + '20' }]}>
            <MaterialIcons name={habit.icon as any} size={32} color={habit.ringColor} />
          </View>
          <Text style={dp.detailCategory}>{CATEGORY_META[habit.category].label}</Text>
        </View>

        <Text style={dp.sectionTitle}>Schedule</Text>

        <View style={dp.segmentRow}>
          <Pressable
            onPress={() => handleModeChange('weekdays')}
            style={[dp.segmentBtn, mode === 'weekdays' ? { backgroundColor: toggleOn } : { borderColor: rule, borderWidth: 1 }]}
          >
            <Text style={[dp.segmentText, { color: mode === 'weekdays' ? '#fff' : ink }]}>Specific Days</Text>
          </Pressable>
          <Pressable
            onPress={() => handleModeChange('goal')}
            style={[dp.segmentBtn, mode === 'goal' ? { backgroundColor: toggleOn } : { borderColor: rule, borderWidth: 1 }]}
          >
            <Text style={[dp.segmentText, { color: mode === 'goal' ? '#fff' : ink }]}>Count Goal</Text>
          </Pressable>
        </View>

        {mode === 'weekdays' && (
          <View style={dp.weekdaySection}>
            <Text style={dp.weekdayLabel}>Active days</Text>
            <WeekdayPicker selectedDays={schedule.habitWeekdays[habit.id] ?? []} onChange={handleWeekdayChange} />
            <Text style={dp.weekdayHint}>No days selected = every day</Text>
          </View>
        )}

        {mode === 'goal' && (
          <View style={dp.weekdaySection}>
            <Text style={dp.weekdayLabel}>Goal count</Text>
            <View style={dp.stepperRow}>
              <Pressable onPress={() => handleCountChange(-1)} style={dp.stepperBtn}>
                <Text style={dp.stepperBtnText}>-</Text>
              </Pressable>
              <Text style={dp.stepperValue}>{goalCount}</Text>
              <Pressable onPress={() => handleCountChange(1)} style={dp.stepperBtn}>
                <Text style={dp.stepperBtnText}>+</Text>
              </Pressable>
            </View>

            <Text style={[dp.weekdayLabel, { marginTop: 16 }]}>Period</Text>
            <View style={dp.pillRow}>
              {PERIODS.map((p) => (
                <Pressable
                  key={p}
                  onPress={() => handlePeriodChange(p)}
                  style={[dp.pill, goalPeriod === p ? { backgroundColor: toggleOn } : { borderColor: rule, borderWidth: 1 }]}
                >
                  <Text style={[dp.pillText, { color: goalPeriod === p ? '#fff' : ink }]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[dp.weekdayHint, { marginTop: 12 }]}>Active days</Text>
            <WeekdayPicker selectedDays={schedule.habitWeekdays[habit.id] ?? previewDays} onChange={handleWeekdayChange} />
            <Text style={[dp.weekdayHint, { marginTop: 4 }]}>We&apos;ll track your pace and cheer you{'\u00A0'}on</Text>
          </View>
        )}

        {habit.id === 'gym' && (
          <>
            <Text style={[dp.sectionTitle, { marginTop: 28 }]}>Strength Protocol</Text>
            <View style={dp.weekdaySection}>
              <Text style={dp.weekdayLabel}>
                {profile.strengthProtocol === 'lplp' ? 'Legs / Pull / Legs / Push' : 'Not set'}
              </Text>
              <Pressable onPress={() => updateProfile({ strengthProtocol: null })} style={dp.changeProtocolBtn}>
                <Text style={dp.changeProtocolText}>Change Protocol</Text>
              </Pressable>
            </View>
          </>
        )}

        {habit.id === 'speed-training' && (
          <>
            <Text style={[dp.sectionTitle, { marginTop: 28 }]}>Speed Protocol</Text>
            <View style={dp.weekdaySection}>
              <Text style={dp.weekdayLabel}>{protocolLabel}</Text>
              <Pressable onPress={() => setShowProtocolPicker(true)} style={dp.changeProtocolBtn}>
                <Text style={dp.changeProtocolText}>Change Protocol</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>

      <Modal visible={showProtocolPicker} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowProtocolPicker(false)}>
        <SafeAreaView style={[dp.container, { backgroundColor: '#fff' }]}>
          <View style={dp.topBar}>
            <Pressable onPress={() => setShowProtocolPicker(false)} hitSlop={12}>
              <MaterialIcons name="close" size={24} color={ink} />
            </Pressable>
            <Text style={dp.topTitle}>Choose Protocol</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={{ padding: 20, gap: 16 }}>
            <Pressable
              onPress={() => { updateProfile({ speedProtocol: 'superspeed-l1' }); setShowProtocolPicker(false); }}
              style={[dp.protocolCard, { borderColor: toggleOn }]}
            >
              <MaterialIcons name="bolt" size={28} color={toggleOn} />
              <View style={dp.protocolCardText}>
                <Text style={dp.protocolCardName}>Super Speed Sticks L1</Text>
                <Text style={dp.protocolCardDesc}>3 weighted sticks, progressive overload</Text>
              </View>
              {profile.speedProtocol === 'superspeed-l1' && <MaterialIcons name="check-circle" size={24} color={toggleOn} />}
            </Pressable>
            <View style={[dp.protocolCard, { borderColor: rule, opacity: 0.5 }]}>
              <MaterialIcons name="speed" size={28} color={sub} />
              <View style={dp.protocolCardText}>
                <Text style={dp.protocolCardName}>BMC&apos;s Speedy Sticks{'\u00A0'}of{'\u00A0'}Quickness</Text>
                <Text style={dp.protocolCardDesc}>Alternative protocol</Text>
              </View>
              <View style={dp.comingSoonBadge}><Text style={dp.comingSoonText}>Coming Soon</Text></View>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════════════
// Styles — Settings screen (spec-matched)
// ═══════════════════════════════════════════════════════════════

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    userSelect: 'none',
  } as any,

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 0,
    paddingBottom: 6,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 17,
    color: ink,
    letterSpacing: -0.02 * 17,
  },

  // Hint
  hint: {
    textAlign: 'center',
    paddingTop: 6,
    paddingBottom: 14,
    paddingHorizontal: 18,
    fontFamily: 'Outfit_500Medium',
    fontSize: 12.5,
    color: sub,
    letterSpacing: -0.005 * 12.5,
  },

  // Scroll content
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 18,
    gap: 10,
  },

  // Section card
  section: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sectionOpen: {
    backgroundColor: '#fff',
    // shadow on iOS
    shadowColor: 'rgba(17,55,31,1)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 22,
    // shadow on Android
    elevation: 4,
  },
  sectionBody: {
    paddingTop: 4,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },

  // Header collapsed
  headerCollapsed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  // Header expanded
  headerExpanded: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 12,
    borderBottomWidth: 1,
    borderBottomColor: rule,
    backgroundColor: paper,
  },

  // Header label (shared)
  headerLabel: {
    fontFamily: 'JetBrainsMono_800ExtraBold',
    fontSize: 11,
    letterSpacing: 0.22 * 11,
    textTransform: 'uppercase',
  },

  // Icon tile (32×32)
  iconTile: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Tracking rows
  trackingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  groupHeader: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 14,
    color: ink,
    letterSpacing: -0.01 * 14,
    marginTop: 12,
    marginBottom: 2,
  },
  selector: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: toggleOff,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorOn: {
    backgroundColor: toggleOn,
    borderWidth: 0,
    // shadow
    shadowColor: 'rgba(58,165,124,1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },

  // Row label (shared)
  rowLabel: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14.5,
    color: ink,
    letterSpacing: -0.005 * 14.5,
  },

  // Row border
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: rule,
  },

  // KV row
  kvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  kvValue: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 14,
    color: ink,
    letterSpacing: 0.04 * 14,
  },

  // Toggle
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 99,
    justifyContent: 'center',
  },
  toggleKnob: {
    position: 'absolute',
    top: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 3,
  },

  // Email text
  emailText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 14.5,
    color: ink,
    letterSpacing: -0.005 * 14.5,
    paddingTop: 4,
    paddingBottom: 12,
  },

  // Danger button
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: clay,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  dangerBtnText: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 14,
    color: clay,
    letterSpacing: -0.005 * 14,
  },

  // Dev row
  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
  },

  // Day stepper
  dayStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  dayStepperBtn: {
    backgroundColor: dayBtnBg,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  dayStepperBtnText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 13,
    color: dayBtnFg,
    letterSpacing: -0.005 * 13,
  },
  dayStepperLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 14.5,
    color: ink,
  },

  // Dev divider
  devDivider: {
    height: 1,
    backgroundColor: rule,
    marginVertical: 2,
  },

  // Data subhead
  dataSubhead: {
    fontFamily: 'JetBrainsMono_800ExtraBold',
    fontSize: 10.5,
    letterSpacing: 0.22 * 10.5,
    color: clay,
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 6,
  },
});

// ═══════════════════════════════════════════════════════════════
// Styles — Habit Detail Panel
// ═══════════════════════════════════════════════════════════════

const dp = StyleSheet.create({
  container: { flex: 1, userSelect: 'none' } as any,
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  topTitle: { fontFamily: 'Outfit_800ExtraBold', fontSize: 17, color: ink, letterSpacing: -0.02 * 17 },
  content: { padding: 20, paddingBottom: 40, gap: 12 },
  sectionTitle: {
    fontFamily: 'JetBrainsMono_700Bold', fontSize: 13, color: sub,
    textTransform: 'uppercase', letterSpacing: 1, marginTop: 24,
  },
  detailHeader: { alignItems: 'center', gap: 8, paddingVertical: 16 },
  detailIconWrap: { width: 64, height: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  detailCategory: { fontFamily: 'Outfit_600SemiBold', fontSize: 14, color: sub },
  segmentRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  segmentBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  segmentText: { fontFamily: 'Outfit_600SemiBold', fontSize: 14 },
  weekdaySection: { paddingTop: 12, gap: 10 },
  weekdayLabel: { fontFamily: 'Outfit_600SemiBold', fontSize: 15, color: ink },
  weekdayHint: { fontFamily: 'Outfit_500Medium', fontSize: 13, color: sub },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stepperBtn: {
    width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: dayBtnBg,
  },
  stepperBtnText: { fontFamily: 'Outfit_700Bold', fontSize: 22, color: dayBtnFg },
  stepperValue: {
    fontFamily: 'Outfit_700Bold', fontSize: 24, color: ink, minWidth: 40, textAlign: 'center',
  },
  pillRow: { flexDirection: 'row', gap: 8 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  pillText: { fontFamily: 'Outfit_600SemiBold', fontSize: 14 },
  changeProtocolBtn: { borderWidth: 1, borderColor: rule, borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 4 },
  changeProtocolText: { fontFamily: 'Outfit_600SemiBold', fontSize: 15, color: toggleOn },
  protocolCard: {
    flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1, gap: 12,
    backgroundColor: paper,
  },
  protocolCardText: { flex: 1, gap: 2 },
  protocolCardName: { fontFamily: 'Outfit_700Bold', fontSize: 16, color: ink },
  protocolCardDesc: { fontFamily: 'Outfit_500Medium', fontSize: 13, color: sub },
  comingSoonBadge: { backgroundColor: rule, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  comingSoonText: { fontFamily: 'Outfit_700Bold', fontSize: 11, color: sub },
});
