import { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useUser } from '@/contexts/user-context';
import { useChallenges } from '@/contexts/challenge-context';
import { useColors } from '@/hooks/use-colors';
import { useHistoryData } from '@/hooks/use-history-data';
import { formatDate } from '@/utils/storage';
import { BoltIcon, DumbbellIcon, CheckIcon } from '@/components/ui/design-icons';
import { WORKOUT_DAYS } from '@/constants/strength-protocols';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const CAL_HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getWorkoutDayLabel(key: string): string {
  const match = WORKOUT_DAYS.find((d) => d.key === key);
  return match ? match.label : key;
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA + 'T00:00:00');
  const b = new Date(dateB + 'T00:00:00');
  return Math.round(Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

export default function HistoryScreen() {
  const { profile } = useUser();
  const { completedChallenges } = useChallenges();
  const colors = useColors();
  const {
    dailyActivity,
    speedStats,
    strengthStats,
    driverTrend,
    speedJourney,
    gymSpeedConnection,
    monthDays,
    activeDaysCount,
    currentStreak,
    loading,
  } = useHistoryData();

  const showSpeed = profile.speedProtocol != null;
  const showStrength = profile.strengthProtocol != null;
  const today = formatDate(new Date());

  // ── Week strip data (Mon–Sun of current week) ──
  const weekDays = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const date = formatDate(d);
      const isFuture = d > now && date !== today;
      const activity = dailyActivity.get(date);
      return {
        label: WEEK_LABELS[i],
        date,
        isToday: date === today,
        isFuture,
        activity,
      };
    });
  }, [dailyActivity, today]);

  // ── Activity feed (reverse chronological, last 30 days) ──
  const feedDays = useMemo(() => {
    const days: { date: string; label: string; activity: NonNullable<ReturnType<typeof dailyActivity.get>> }[] = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const date = formatDate(d);
      const activity = dailyActivity.get(date);
      if (!activity) continue;
      if (!activity.speedSession && !activity.strengthSession && activity.habitsCompleted === 0) continue;

      let label: string;
      if (i === 0) label = 'Today';
      else if (i === 1) label = 'Yesterday';
      else {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        label = `${dayNames[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
      }
      days.push({ date, label, activity });
    }
    return days;
  }, [dailyActivity]);

  // ── Calendar grid ──
  const calendarGrid = useMemo(() => {
    if (monthDays.length === 0) return [];
    const firstDate = new Date(monthDays[0].date + 'T00:00:00');
    const startDow = firstDate.getDay(); // 0=Sun
    const cells: ({ date: string; level: 0 | 1 | 2 | 3 } | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (const day of monthDays) cells.push(day);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [monthDays]);

  const now = new Date();
  const monthLabel = `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
  const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  // PR recency check
  const isNewPR = speedStats?.driverPR?.date
    ? daysBetween(speedStats.driverPR.date, today) <= 2
    : false;

  // Records bar
  const totalSessions = useMemo(() => {
    let count = 0;
    for (const [, day] of dailyActivity) {
      if (day.speedSession) count++;
      if (day.strengthSession) count++;
    }
    return count;
  }, [dailyActivity]);

  const bestStreak = Math.max(strengthStats?.bestStreak ?? 0, currentStreak);
  const challengeCount = completedChallenges.filter((c) => c.status === 'completed').length;

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={[styles.title, { color: colors.text }]}>History</Text>

        {/* Section A: Speed Hero Card */}
        {showSpeed && (
          <Pressable
            onPress={() => router.push('/stats-speed')}
            style={[styles.heroCard, { backgroundColor: colors.tint + '26' }]}
          >
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={colors.textSecondary}
              style={styles.heroChevron}
            />
            {speedStats?.driverPR ? (
              <>
                {isNewPR && (
                  <View style={[styles.prBadge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.prBadgeText}>NEW PR</Text>
                  </View>
                )}
                <Text style={[styles.heroNumber, { color: colors.text }]}>
                  {speedStats.driverPR.mph}
                </Text>
                <Text style={[styles.heroUnit, { color: colors.textSecondary }]}>mph</Text>
                {driverTrend.direction === 'up' && (
                  <Text style={[styles.trendText, { color: colors.accent }]}>
                    ↑ {driverTrend.delta} mph this&nbsp;month
                  </Text>
                )}
                {driverTrend.direction === 'flat' && (
                  <Text style={[styles.trendText, { color: colors.textSecondary }]}>
                    → Holding steady
                  </Text>
                )}
                {driverTrend.direction === 'down' && (
                  <Text style={[styles.trendText, { color: colors.textSecondary }]}>
                    Train to get back on&nbsp;track
                  </Text>
                )}
                {speedJourney && (
                  <Text style={[styles.journeyText, { color: colors.textSecondary }]}>
                    Started at {speedJourney.firstMph} → Now at&nbsp;{speedJourney.currentMph}
                  </Text>
                )}
              </>
            ) : (
              <Text style={[styles.heroEmpty, { color: colors.textSecondary }]}>
                Complete your first speed session to see your{'\u00A0'}progress
              </Text>
            )}
          </Pressable>
        )}

        {/* Section B: This Week Strip */}
        <View style={styles.weekStrip}>
          {weekDays.map((day) => {
            const habitStatus = day.isFuture
              ? 'future'
              : !day.activity || day.activity.habitsCompleted === 0
                ? 'none'
                : day.activity.habitsCompleted >= day.activity.habitsTotal
                  ? 'all'
                  : 'some';

            return (
              <View
                key={day.date}
                style={[
                  styles.weekDay,
                  day.isToday && { borderColor: colors.accent, borderWidth: 1.5 },
                ]}
              >
                <Text style={[styles.weekDayLabel, { color: colors.textSecondary }]}>
                  {day.label}
                </Text>
                <View
                  style={[
                    styles.weekDot,
                    habitStatus === 'all' && { backgroundColor: colors.accent },
                    habitStatus === 'some' && { backgroundColor: '#F59E0B' },
                    habitStatus === 'none' && { borderWidth: 1.5, borderColor: colors.border },
                    habitStatus === 'future' && { borderWidth: 1, borderColor: colors.border, opacity: 0.4 },
                  ]}
                />
                <View style={styles.weekBadges}>
                  {day.activity?.speedSession && (
                    <View style={[styles.sessionBadge, { backgroundColor: colors.accent + '30' }]}>
                      <Text style={[styles.sessionBadgeText, { color: colors.accent }]}>S</Text>
                    </View>
                  )}
                  {day.activity?.strengthSession && (
                    <View style={[styles.sessionBadge, { backgroundColor: colors.accent + '30' }]}>
                      <Text style={[styles.sessionBadgeText, { color: colors.accent }]}>G</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Section C: Gym-to-Speed Connection Card */}
        {gymSpeedConnection && showSpeed && showStrength && (
          <Pressable
            onPress={() => router.push('/stats-strength')}
            style={[styles.connectionCard, { backgroundColor: colors.tint + '15' }]}
          >
            <Text style={[styles.connectionTitle, { color: colors.text }]}>
              Strength → Speed
            </Text>
            <Text style={[styles.connectionBody, { color: colors.textSecondary }]}>
              {gymSpeedConnection.gymSessions30d} gym sessions this&nbsp;month
            </Text>
            {gymSpeedConnection.driverDelta > 0 ? (
              <Text style={[styles.connectionBody, { color: colors.accent }]}>
                Your driver speed is up {gymSpeedConnection.driverDelta}&nbsp;mph
              </Text>
            ) : gymSpeedConnection.driverDelta === 0 && gymSpeedConnection.gymSessions30d > 0 ? (
              <Text style={[styles.connectionBody, { color: colors.textSecondary }]}>
                Building the power for your next speed{'\u00A0'}PR
              </Text>
            ) : (
              <Text style={[styles.connectionBody, { color: colors.textSecondary }]}>
                Keep building — the speed will{'\u00A0'}follow
              </Text>
            )}
            {strengthStats?.lastPR && (
              <Text style={[styles.connectionSub, { color: colors.textSecondary }]}>
                {strengthStats.lastPR.exerciseName} PR: {strengthStats.lastPR.weight} lbs — fueling your{'\u00A0'}swing
              </Text>
            )}
          </Pressable>
        )}

        {/* Section D: Monthly Consistency Calendar */}
        <View style={styles.calSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {monthLabel}
          </Text>
          <View style={styles.calHeaders}>
            {CAL_HEADERS.map((h, i) => (
              <Text key={i} style={[styles.calHeaderText, { color: colors.textSecondary }]}>
                {h}
              </Text>
            ))}
          </View>
          <View style={styles.calGrid}>
            {calendarGrid.map((cell, i) => {
              if (!cell) return <View key={i} style={styles.calCell} />;
              const isToday = cell.date === today;
              const levelOpacity =
                cell.level === 0 ? 0 : cell.level === 1 ? 0.2 : cell.level === 2 ? 0.5 : 1;
              return (
                <View
                  key={cell.date}
                  style={[
                    styles.calCell,
                    styles.calCellFilled,
                    cell.level === 0
                      ? { backgroundColor: colors.border }
                      : { backgroundColor: colors.accent, opacity: levelOpacity },
                    isToday && { borderWidth: 2, borderColor: colors.accent, opacity: 1 },
                  ]}
                >
                  {isToday && cell.level > 0 && (
                    <View
                      style={[
                        styles.calCellInner,
                        { backgroundColor: colors.accent, opacity: levelOpacity },
                      ]}
                    />
                  )}
                </View>
              );
            })}
          </View>
          <Text style={[styles.calFooter, { color: colors.textSecondary }]}>
            {activeDaysCount} of {totalDaysInMonth} days active
            {currentStreak > 0 ? ` · ${currentStreak}-day streak` : ''}
          </Text>
        </View>

        {/* Section E: Recent Activity Feed */}
        <View style={styles.feedSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Recent Activity
          </Text>
          {feedDays.length === 0 && (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No activity in the last 30&nbsp;days
            </Text>
          )}
          {feedDays.map(({ date, label, activity }) => (
            <View key={date} style={styles.feedDay}>
              <Text style={[styles.feedDateHeader, { color: colors.text }]}>{label}</Text>

              {activity.speedSession && (
                <View style={[styles.feedEntry, { borderColor: colors.border }]}>
                  <BoltIcon size={18} color={colors.accent} />
                  <View style={styles.feedEntryContent}>
                    <Text style={[styles.feedLabel, { color: colors.text }]}>Speed Training</Text>
                    <View style={styles.feedStatRow}>
                      <Text style={[styles.feedStat, { color: colors.textSecondary }]}>
                        Driver {activity.speedSession.driverMph ?? '—'} mph
                      </Text>
                      {speedStats?.driverPR?.date === date &&
                        speedStats?.driverPR?.mph === activity.speedSession.driverMph && (
                          <View style={[styles.feedPrBadge, { backgroundColor: colors.accent }]}>
                            <Text style={styles.feedPrText}>PR</Text>
                          </View>
                        )}
                    </View>
                    {activity.speedSession.greenMph != null && (
                      <Text style={[styles.feedStatSecondary, { color: colors.textSecondary }]}>
                        Green {activity.speedSession.greenMph} mph
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {activity.strengthSession && (
                <View style={[styles.feedEntry, { borderColor: colors.border }]}>
                  <DumbbellIcon size={18} color={colors.accent} />
                  <View style={styles.feedEntryContent}>
                    <Text style={[styles.feedLabel, { color: colors.text }]}>
                      {getWorkoutDayLabel(activity.strengthSession.workoutDay)} Day
                    </Text>
                    <Text style={[styles.feedStat, { color: colors.textSecondary }]}>
                      Volume: {activity.strengthSession.volume.toLocaleString()} lbs
                    </Text>
                    {strengthStats?.lastPR?.date === date && (
                      <Text style={[styles.feedStatSecondary, { color: colors.textSecondary }]}>
                        {strengthStats.lastPR.exerciseName} PR: {strengthStats.lastPR.weight} lbs
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {!activity.speedSession && !activity.strengthSession && activity.habitsCompleted > 0 && (
                <View style={[styles.feedEntry, { borderColor: colors.border }]}>
                  <CheckIcon size={18} color={colors.accent} />
                  <View style={styles.feedEntryContent}>
                    <Text style={[styles.feedLabel, { color: colors.text }]}>
                      {activity.habitsCompleted}/{activity.habitsTotal} habits completed
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
          {feedDays.length > 0 && (
            <Text style={[styles.feedFooter, { color: colors.textSecondary }]}>
              Showing last 30&nbsp;days
            </Text>
          )}
        </View>

        {/* Section F: Records Bar */}
        <View style={styles.recordsBar}>
          <RecordStat label="Best Streak" value={bestStreak} colors={colors} />
          <RecordStat label="Sessions" value={totalSessions} colors={colors} />
          <RecordStat label="Challenges" value={challengeCount} colors={colors} />
        </View>

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function RecordStat({
  label,
  value,
  colors,
}: {
  label: string;
  value: number;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.recordItem}>
      <Text style={[styles.recordValue, { color: colors.textSecondary }]}>{value}</Text>
      <Text style={[styles.recordLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: 'none',
  } as any,
  content: {
    padding: 20,
    paddingTop: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 24,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },

  // Hero Card
  heroCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  heroChevron: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  prBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  prBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heroNumber: {
    fontSize: 56,
    fontWeight: '800',
  },
  heroUnit: {
    fontSize: 16,
    marginTop: -4,
    marginBottom: 8,
  },
  trendText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  journeyText: {
    fontSize: 13,
    marginTop: 6,
  },
  heroEmpty: {
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 20,
  },

  // Week Strip
  weekStrip: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 20,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  weekDayLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  weekDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  weekBadges: {
    flexDirection: 'row',
    gap: 3,
    minHeight: 16,
  },
  sessionBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  sessionBadgeText: {
    fontSize: 9,
    fontWeight: '800',
  },

  // Connection Card
  connectionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  connectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  connectionBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  connectionSub: {
    fontSize: 12,
    marginTop: 8,
  },

  // Calendar
  calSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  calHeaders: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  calHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 3,
  },
  calCellFilled: {
    borderRadius: 6,
    maxWidth: 36,
    maxHeight: 36,
    margin: 'auto',
    width: 36,
    height: 36,
  },
  calCellInner: {
    flex: 1,
    borderRadius: 4,
  },
  calFooter: {
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },

  // Feed
  feedSection: {
    marginBottom: 24,
  },
  feedDay: {
    marginBottom: 16,
  },
  feedDateHeader: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  feedEntry: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  feedEntryContent: {
    flex: 1,
  },
  feedLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  feedStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feedStat: {
    fontSize: 13,
  },
  feedPrBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  feedPrText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  feedStatSecondary: {
    fontSize: 12,
    marginTop: 2,
  },
  feedFooter: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },

  // Records Bar
  recordsBar: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  recordItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  recordValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  recordLabel: {
    fontSize: 11,
  },

  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
