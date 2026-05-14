import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  LayoutAnimation,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BarChart } from 'react-native-gifted-charts';
import { useColors } from '@/hooks/use-colors';
import { useStrengthDetail } from '@/hooks/use-strength-detail';
import type { SessionVolume, CurrentCycle } from '@/hooks/use-strength-detail';
import {
  WORKOUT_DAYS,
  STREAK_MILESTONES,
  type StrengthSession,
  type WorkoutDay,
} from '@/constants/strength-protocols';
import type { StrengthStats } from '@/utils/storage';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ── Workout day colors (cohesive set) ────────────────────────

const DAY_COLORS: Record<WorkoutDay, string> = {
  legs1: '#52B788',
  pull: '#3B82F6',
  legs2: '#F59E0B',
  push: '#EF4444',
};

const DAY_SHORT: Record<WorkoutDay, string> = {
  legs1: 'L1',
  pull: 'Pull',
  legs2: 'L2',
  push: 'Push',
};

// ── Date formatting ──────────────────────────────────────────

function fmtMonthDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function fmtWeekday(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[d.getDay()];
}

function fmtFullDate(dateStr: string): string {
  return `${fmtWeekday(dateStr)}, ${fmtMonthDay(dateStr)}`;
}

// ── Main Screen ──────────────────────────────────────────────

export default function StatsStrengthScreen() {
  const colors = useColors();
  const data = useStrengthDetail();
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  if (data.loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <TopBar colors={colors} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (data.sessions.length === 0 && data.strengthStats === null) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <TopBar colors={colors} />
        <View style={styles.center}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Complete a strength workout to see your stats&nbsp;here.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TopBar colors={colors} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <RotationProgressSection cycle={data.currentCycle} colors={colors} />
        <VolumeSection volumes={data.sessionVolumes} colors={colors} />
        <PersonalRecordsSection
          strengthStats={data.strengthStats}
          mostRecentDate={data.sessions.length > 0 ? data.sessions[0].date : null}
          colors={colors}
        />
        <StreakSection strengthStats={data.strengthStats} colors={colors} />
        <SessionHistorySection
          sessions={data.sessions}
          colors={colors}
          expandedDate={expandedDate}
          onToggle={(date) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setExpandedDate(expandedDate === date ? null : date);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Top Bar ──────────────────────────────────────────────────

function TopBar({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.topBar}>
      <Pressable onPress={() => router.back()} hitSlop={12}>
        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={[styles.topTitle, { color: colors.text }]}>Strength Stats</Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

// ── Section 1: Rotation Progress ─────────────────────────────

function RotationProgressSection({
  cycle,
  colors,
}: {
  cycle: CurrentCycle;
  colors: ReturnType<typeof useColors>;
}) {
  const rotation: WorkoutDay[] = ['legs1', 'pull', 'legs2', 'push'];

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ROTATION PROGRESS</Text>

      <View style={styles.rotationRow}>
        {rotation.map((day) => {
          const done = cycle.completed.includes(day);
          return (
            <View
              key={day}
              style={[
                styles.rotationPill,
                done
                  ? { backgroundColor: colors.accent }
                  : { borderWidth: 1, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.rotationLabel,
                  { color: done ? '#fff' : colors.textSecondary },
                ]}
              >
                {DAY_SHORT[day]}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={[styles.subText, { color: colors.textSecondary }]}>
        {cycle.total === 0 && cycle.completed.length === 0
          ? 'Start your first rotation'
          : `${cycle.total} cycles completed`}
      </Text>
    </View>
  );
}

// ── Section 2: Volume Trend ──────────────────────────────────

function VolumeSection({
  volumes,
  colors,
}: {
  volumes: SessionVolume[];
  colors: ReturnType<typeof useColors>;
}) {
  if (volumes.length < 2) {
    return (
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SESSION VOLUME</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Log more sessions to see volume&nbsp;trends
        </Text>
      </View>
    );
  }

  const chartWidth = SCREEN_WIDTH - 80;

  const barData = volumes.map((v) => ({
    value: v.volume,
    label: fmtMonthDay(v.date),
    frontColor: DAY_COLORS[v.workoutDay],
    topLabelComponent: undefined as (() => React.ReactElement) | undefined,
  }));

  const maxVolume = Math.max(...volumes.map((v) => v.volume));

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SESSION VOLUME</Text>
      <View style={{ marginLeft: -10 }}>
        <BarChart
          data={barData}
          width={chartWidth}
          height={200}
          barWidth={Math.min(28, (chartWidth - 40) / barData.length - 6)}
          spacing={Math.min(12, (chartWidth - 40) / barData.length / 3)}
          noOfSections={4}
          maxValue={Math.ceil(maxVolume * 1.15)}
          yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 9 }}
          yAxisColor="transparent"
          xAxisColor={colors.border}
          rulesType="dashed"
          rulesColor={colors.border}
          disableScroll
          adjustToWidth
          isAnimated
        />
      </View>
      <Text style={[styles.subText, { color: colors.textSecondary }]}>
        Volume = weight x reps (completed sets)
      </Text>
    </View>
  );
}

// ── Section 3: Personal Records ──────────────────────────────

function PersonalRecordsSection({
  strengthStats,
  mostRecentDate,
  colors,
}: {
  strengthStats: StrengthStats | null;
  mostRecentDate: string | null;
  colors: ReturnType<typeof useColors>;
}) {
  const renderedIds = new Set<string>();

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PERSONAL RECORDS</Text>

      {WORKOUT_DAYS.map((day) => {
        const exercises = day.exercises.filter((ex) => {
          if (renderedIds.has(ex.id)) return false;
          renderedIds.add(ex.id);
          return true;
        });

        if (exercises.length === 0) return null;

        return (
          <View key={day.key} style={styles.prGroup}>
            <Text style={[styles.prGroupTitle, { color: colors.text }]}>
              {day.label} <Text style={{ color: colors.textSecondary, fontWeight: '400' }}>{'\u2014'} {day.subtitle}</Text>
            </Text>

            {exercises.map((ex) => {
              const pr = strengthStats?.exercisePRs[ex.id];
              const isNew = pr && mostRecentDate && pr.date === mostRecentDate;

              return (
                <View key={ex.id} style={styles.prRow}>
                  <Text style={[styles.prName, { color: colors.text }]}>{ex.name}</Text>
                  <View style={styles.prValueCol}>
                    {pr ? (
                      <>
                        <View style={styles.prValueRow}>
                          <Text style={[styles.prWeight, { color: colors.text }]}>
                            {pr.weight} lbs x {pr.reps}
                          </Text>
                          {isNew && (
                            <View style={[styles.newBadge, { backgroundColor: colors.accent }]}>
                              <Text style={styles.newBadgeText}>NEW</Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.prDate, { color: colors.textSecondary }]}>
                          {fmtMonthDay(pr.date)}
                        </Text>
                      </>
                    ) : (
                      <Text style={[styles.prWeight, { color: colors.textSecondary }]}>{'\u2014'}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

// ── Section 4: Streak ────────────────────────────────────────

function StreakSection({
  strengthStats,
  colors,
}: {
  strengthStats: StrengthStats | null;
  colors: ReturnType<typeof useColors>;
}) {
  const current = strengthStats?.streak.days ?? 0;
  const best = strengthStats?.bestStreak ?? 0;

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>STREAK</Text>

      <View style={styles.streakBoxes}>
        <View style={[styles.streakBox, { borderColor: colors.border }]}>
          <Text style={[styles.streakNumber, { color: colors.text }]}>{current}</Text>
          <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Current</Text>
        </View>
        <View style={[styles.streakBox, { borderColor: colors.border }]}>
          <Text style={[styles.streakNumber, { color: colors.text }]}>{best}</Text>
          <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>Best</Text>
        </View>
      </View>

      <View style={styles.milestoneRow}>
        {STREAK_MILESTONES.map((m) => {
          const achieved = best >= m;
          return (
            <View
              key={m}
              style={[
                styles.milestone,
                achieved
                  ? { backgroundColor: colors.accent }
                  : { borderWidth: 1, borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.milestoneText,
                  { color: achieved ? '#fff' : colors.textSecondary },
                ]}
              >
                {m}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ── Section 5: Session History ───────────────────────────────

function SessionHistorySection({
  sessions,
  colors,
  expandedDate,
  onToggle,
}: {
  sessions: StrengthSession[];
  colors: ReturnType<typeof useColors>;
  expandedDate: string | null;
  onToggle: (date: string) => void;
}) {
  // Find exercise name by ID
  const exerciseNameMap = new Map<string, string>();
  for (const day of WORKOUT_DAYS) {
    for (const ex of day.exercises) {
      if (!exerciseNameMap.has(ex.id)) {
        exerciseNameMap.set(ex.id, ex.name);
      }
    }
  }

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>RECENT SESSIONS</Text>

      {sessions.map((session) => {
        let totalVolume = 0;
        for (const ex of session.exercises) {
          for (const set of ex.sets) {
            if (set.completed) {
              totalVolume += (set.weight ?? 0) * set.reps;
            }
          }
        }

        const dayDef = WORKOUT_DAYS.find((d) => d.key === session.workoutDay);
        const expanded = expandedDate === session.date;

        return (
          <View key={session.date}>
            <Pressable
              style={[styles.historyRow, { borderBottomColor: colors.border }]}
              onPress={() => onToggle(session.date)}
            >
              <View style={styles.historyLeft}>
                <Text style={[styles.historyDate, { color: colors.text }]}>
                  {fmtFullDate(session.date)}
                </Text>
                <Text style={[styles.historyDay, { color: colors.textSecondary }]}>
                  {dayDef?.label ?? session.workoutDay}
                </Text>
              </View>
              <Text style={[styles.historyVolume, { color: colors.text }]}>
                {totalVolume.toLocaleString()} lbs
              </Text>
            </Pressable>

            {expanded && (
              <View style={[styles.expandedContent, { backgroundColor: colors.background }]}>
                {session.exercises.map((exLog) => (
                  <View key={exLog.exerciseId} style={styles.expandedExercise}>
                    <Text style={[styles.expandedExName, { color: colors.text }]}>
                      {exerciseNameMap.get(exLog.exerciseId) ?? exLog.exerciseId}
                    </Text>
                    {exLog.sets.map((set, i) => (
                      <Text
                        key={i}
                        style={[styles.expandedSet, { color: colors.textSecondary }]}
                      >
                        {set.completed
                          ? `Set ${i + 1}: ${set.weight ?? 0} lbs x ${set.reps} \u2713`
                          : `Set ${i + 1}: \u2014 (skipped)`}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },

  // Shared section
  section: {
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 24,
  },
  subText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },

  // Section 1: Rotation
  rotationRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  rotationPill: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 60,
    alignItems: 'center',
  },
  rotationLabel: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Section 3: PRs
  prGroup: {
    marginBottom: 16,
  },
  prGroupTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  prRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  prName: {
    fontSize: 14,
    flex: 1,
  },
  prValueCol: {
    alignItems: 'flex-end',
  },
  prValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  prWeight: {
    fontSize: 15,
    fontWeight: '600',
  },
  prDate: {
    fontSize: 11,
    marginTop: 1,
  },
  newBadge: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  // Section 4: Streak
  streakBoxes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  streakBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 16,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '700',
  },
  streakLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  milestoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  milestone: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // Section 5: Session History
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  historyLeft: {
    flex: 1,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyDay: {
    fontSize: 12,
    marginTop: 2,
  },
  historyVolume: {
    fontSize: 14,
    fontWeight: '600',
  },
  expandedContent: {
    borderRadius: 10,
    padding: 12,
    marginBottom: 4,
  },
  expandedExercise: {
    marginBottom: 10,
  },
  expandedExName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  expandedSet: {
    fontSize: 12,
    marginLeft: 8,
    lineHeight: 20,
  },
});
