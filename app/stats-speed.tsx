import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LineChart } from 'react-native-gifted-charts';
import { useColors } from '@/hooks/use-colors';
import { useSpeedDetailData } from '@/hooks/use-speed-detail-data';
import { STICK_COLORS, type SpeedSession, type StickColor } from '@/constants/speed-protocols';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ── Date formatting helpers ───────────────────────────────────

function fmtMonthDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function fmtLongDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function fmtShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

function fmtDateRange(start: string, end: string): string {
  return `${fmtLongDate(start)} \u2014 ${fmtLongDate(end)}`;
}

// ── Main Screen ──────────────────────────────────────────────

export default function StatsSpeedScreen() {
  const colors = useColors();
  const data = useSpeedDetailData();
  const [selectedSession, setSelectedSession] = useState<SpeedSession | null>(null);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TopBar colors={colors} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <DriverTrendSection driverSpeeds={data.driverSpeeds} colors={colors} />
        <StickPRsSection stickPRs={data.stickPRs} colors={colors} />
        <DomNonDomGapSection gaps={data.domNonDomGap} colors={colors} />
        <TransferRateSection transferRate={data.transferRate} colors={colors} />
        <SessionHistorySection
          sessions={data.sessions}
          colors={colors}
          onSessionPress={setSelectedSession}
        />
        <ConsistencySection weeks={data.weeklyConsistency} colors={colors} />
        <ProtocolProgressSection summary={data.protocolSummary} colors={colors} />
      </ScrollView>

      <SessionDetailModal
        session={selectedSession}
        sessionNumber={
          selectedSession
            ? data.sessions.findIndex((s) => s.date === selectedSession.date) + 1
            : 0
        }
        colors={colors}
        onClose={() => setSelectedSession(null)}
      />
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
      <Text style={[styles.topTitle, { color: colors.text }]}>Speed Stats</Text>
      <View style={{ width: 24 }} />
    </View>
  );
}

// ── Section A: Driver Speed Trend ────────────────────────────

function DriverTrendSection({
  driverSpeeds,
  colors,
}: {
  driverSpeeds: { date: string; mph: number }[];
  colors: ReturnType<typeof useColors>;
}) {
  if (driverSpeeds.length < 2) {
    return (
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DRIVER SPEED TREND</Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Complete more sessions to see your&nbsp;trend
        </Text>
      </View>
    );
  }

  const mphValues = driverSpeeds.map((d) => d.mph);
  const minMph = Math.min(...mphValues);
  const maxMph = Math.max(...mphValues);
  const yMin = Math.floor(minMph - 5);
  const yMax = Math.ceil(maxMph + 5);

  const chartData = driverSpeeds.map((d) => ({
    value: d.mph,
    dataPointText: String(d.mph),
    label: fmtMonthDay(d.date),
  }));

  const chartWidth = SCREEN_WIDTH - 80;

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DRIVER SPEED TREND</Text>
      <View style={{ marginLeft: -10 }}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={220}
          color={colors.accent}
          dataPointsColor={colors.accent}
          dataPointsRadius={6}
          showDataPointOnFocus
          textColor={colors.textSecondary}
          textFontSize={10}
          yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: colors.textSecondary, fontSize: 9 }}
          yAxisColor="transparent"
          xAxisColor={colors.border}
          yAxisOffset={yMin}
          maxValue={yMax - yMin}
          noOfSections={Math.min(Math.ceil((yMax - yMin) / 5), 8)}
          areaChart
          startFillColor={colors.accent}
          startOpacity={0.2}
          endFillColor={colors.accent}
          endOpacity={0}
          curved
          showYAxisIndices={false}
          rulesType="dashed"
          rulesColor={colors.border}
          horizontalRulesStyle={{ strokeDasharray: '4,4' }}
          yAxisExtraHeight={10}
          adjustToWidth
          disableScroll
        />
      </View>
      <Text style={[styles.subText, { color: colors.textSecondary }]}>90-day history</Text>
    </View>
  );
}

// ── Section B: Per-Stick PRs ─────────────────────────────────

function StickPRsSection({
  stickPRs,
  colors,
}: {
  stickPRs: Record<string, { mph: number; date: string } | null>;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>STICK PRs</Text>

      {/* Header row */}
      <View style={styles.prHeaderRow}>
        <View style={{ width: 90 }} />
        <Text style={[styles.prHeaderLabel, { color: colors.textSecondary }]}>Dom</Text>
        <Text style={[styles.prHeaderLabel, { color: colors.textSecondary }]}>Non-Dom</Text>
      </View>

      {STICK_COLORS.map((sc) => {
        const domPR = stickPRs[`${sc.key}-dom`];
        const nonDomPR = stickPRs[`${sc.key}-nonDom`];

        return (
          <View key={sc.key} style={styles.prRow}>
            <View style={styles.prLabel}>
              <View style={[styles.colorDot, { backgroundColor: sc.color }]} />
              <Text style={[styles.prLabelText, { color: colors.text }]}>{sc.label}</Text>
            </View>
            <View style={styles.prValue}>
              <Text style={[styles.prMph, { color: colors.text }]}>
                {domPR ? `${domPR.mph}` : '\u2014'}
              </Text>
              {domPR && (
                <Text style={[styles.prDate, { color: colors.textSecondary }]}>
                  {fmtShortDate(domPR.date)}
                </Text>
              )}
            </View>
            <View style={styles.prValue}>
              <Text style={[styles.prMph, { color: colors.text }]}>
                {nonDomPR ? `${nonDomPR.mph}` : '\u2014'}
              </Text>
              {nonDomPR && (
                <Text style={[styles.prDate, { color: colors.textSecondary }]}>
                  {fmtShortDate(nonDomPR.date)}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// ── Section C: Dom vs Non-Dom Gap ────────────────────────────

function DomNonDomGapSection({
  gaps,
  colors,
}: {
  gaps: { color: StickColor; label: string; currentGap: number; previousGap: number; trend: 'closing' | 'widening' | 'stable' }[];
  colors: ReturnType<typeof useColors>;
}) {
  if (gaps.length === 0) return null;

  const trendIcon = { closing: '\u2193', widening: '\u2191', stable: '\u2192' };
  const trendColor = (t: string) =>
    t === 'closing' ? colors.accent : t === 'widening' ? colors.streakBadge : colors.textSecondary;

  // Find most significant closing gap for summary
  const closingGaps = gaps.filter((g) => g.trend === 'closing');
  const bestClosing = closingGaps.length > 0
    ? closingGaps.reduce((a, b) => (b.previousGap - b.currentGap > a.previousGap - a.currentGap ? b : a))
    : null;

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DOM vs NON-DOM GAP</Text>

      {gaps.map((g) => (
        <View key={g.color} style={styles.gapRow}>
          <View style={styles.gapLabel}>
            <View style={[styles.colorDot, { backgroundColor: STICK_COLORS.find((s) => s.key === g.color)!.color }]} />
            <Text style={[styles.gapLabelText, { color: colors.text }]}>{g.label}</Text>
          </View>
          <Text style={[styles.gapValue, { color: colors.text }]}>
            +{Math.abs(g.currentGap)} mph
          </Text>
          <Text style={[styles.gapTrend, { color: trendColor(g.trend) }]}>
            {trendIcon[g.trend]}
          </Text>
        </View>
      ))}

      {bestClosing && (
        <Text style={[styles.gapSummary, { color: colors.textSecondary }]}>
          Your non-dominant {bestClosing.label.toLowerCase()} side has gained{' '}
          {Math.round(Math.abs(bestClosing.previousGap - bestClosing.currentGap) * 10) / 10} mph on your dominant side this&nbsp;month.
        </Text>
      )}
    </View>
  );
}

// ── Section D: Transfer Rate ─────────────────────────────────

function TransferRateSection({
  transferRate,
  colors,
}: {
  transferRate: { stickGain: number; driverGain: number; assessment: 'good' | 'lagging' } | null;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>TRANSFER RATE</Text>

      {!transferRate ? (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Need more sessions to calculate transfer&nbsp;rate.
        </Text>
      ) : transferRate.assessment === 'good' ? (
        <>
          <Text style={[styles.transferMessage, { color: colors.accent }]}>
            Your stick gains are transferring well to your&nbsp;driver.
          </Text>
          <View style={styles.transferStats}>
            <Text style={[styles.transferStat, { color: colors.textSecondary }]}>
              Stick gain: {transferRate.stickGain > 0 ? '+' : ''}{transferRate.stickGain} mph
            </Text>
            <Text style={[styles.transferStat, { color: colors.textSecondary }]}>
              Driver gain: {transferRate.driverGain > 0 ? '+' : ''}{transferRate.driverGain} mph
            </Text>
          </View>
        </>
      ) : (
        <>
          <Text style={[styles.transferMessage, { color: colors.streakBadge }]}>
            {"Your driver speed hasn\u2019t caught up to your stick progress\u00A0yet."}
          </Text>
          <View style={styles.transferStats}>
            <Text style={[styles.transferStat, { color: colors.textSecondary }]}>
              Stick gain: {transferRate.stickGain > 0 ? '+' : ''}{transferRate.stickGain} mph
            </Text>
            <Text style={[styles.transferStat, { color: colors.textSecondary }]}>
              Driver gain: {transferRate.driverGain > 0 ? '+' : ''}{transferRate.driverGain} mph
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

// ── Section E: Session History ───────────────────────────────

function SessionHistorySection({
  sessions,
  colors,
  onSessionPress,
}: {
  sessions: SpeedSession[];
  colors: ReturnType<typeof useColors>;
  onSessionPress: (session: SpeedSession) => void;
}) {
  const totalCount = sessions.length;
  // Display most recent first, show last 20
  const displayed = [...sessions].reverse().slice(0, 20);

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SESSION HISTORY</Text>

      {/* Header */}
      <View style={styles.historyHeader}>
        <Text style={[styles.historyHeaderCell, { color: colors.textSecondary, width: 40 }]}>#</Text>
        <Text style={[styles.historyHeaderCell, { color: colors.textSecondary, flex: 1 }]}>Date</Text>
        <Text style={[styles.historyHeaderCell, { color: colors.textSecondary, width: 60, textAlign: 'right' }]}>Driver</Text>
        <Text style={[styles.historyHeaderCell, { color: colors.textSecondary, width: 60, textAlign: 'right' }]}>Green</Text>
      </View>

      {displayed.map((session) => {
        const sessionNum = sessions.findIndex((s) => s.date === session.date) + 1;
        return (
          <Pressable
            key={session.date}
            style={[styles.historyRow, { borderBottomColor: colors.border }]}
            onPress={() => onSessionPress(session)}
          >
            <Text style={[styles.historyCell, { color: colors.textSecondary, width: 40 }]}>
              #{sessionNum}
            </Text>
            <Text style={[styles.historyCell, { color: colors.text, flex: 1 }]}>
              {fmtLongDate(session.date)}
            </Text>
            <Text style={[styles.historyCell, { color: colors.text, width: 60, textAlign: 'right' }]}>
              {session.maxOut.driver != null ? session.maxOut.driver : '\u2014'}
            </Text>
            <Text style={[styles.historyCell, { color: colors.text, width: 60, textAlign: 'right' }]}>
              {session.maxOut.green != null ? session.maxOut.green : '\u2014'}
            </Text>
          </Pressable>
        );
      })}

      {totalCount > 20 && (
        <Text style={[styles.subText, { color: colors.textSecondary, marginTop: 8 }]}>
          Showing last 20 of {totalCount} sessions
        </Text>
      )}
    </View>
  );
}

// ── Section F: Consistency ───────────────────────────────────

function ConsistencySection({
  weeks,
  colors,
}: {
  weeks: { weekStart: string; count: number; hitMinimum: boolean }[];
  colors: ReturnType<typeof useColors>;
}) {
  const maxBar = 7;
  const barMaxHeight = 80;

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>WEEKLY CONSISTENCY</Text>

      <View style={styles.consistencyRow}>
        {weeks.map((w) => {
          const barHeight = Math.max((w.count / maxBar) * barMaxHeight, w.count > 0 ? 8 : 2);
          const barColor =
            w.hitMinimum ? colors.accent : w.count > 0 ? colors.streakBadge : colors.border;

          return (
            <View key={w.weekStart} style={styles.consistencyCol}>
              <View style={styles.consistencyBarWrap}>
                <View
                  style={[
                    styles.consistencyBar,
                    { height: barHeight, backgroundColor: barColor },
                  ]}
                />
              </View>
              <Text style={[styles.consistencyLabel, { color: colors.textSecondary }]}>
                {fmtMonthDay(w.weekStart)}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={[styles.subText, { color: colors.textSecondary }]}>
        3+ sessions/week = on track
      </Text>
    </View>
  );
}

// ── Section G: Protocol Progress ─────────────────────────────

function ProtocolProgressSection({
  summary,
  colors,
}: {
  summary: { name: string; totalSessions: number; firstDate: string; lastDate: string; driverGain: number } | null;
  colors: ReturnType<typeof useColors>;
}) {
  if (!summary) return null;

  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PROTOCOL PROGRESS</Text>

      <Text style={[styles.protocolName, { color: colors.text }]}>{summary.name}</Text>
      <Text style={[styles.protocolStat, { color: colors.textSecondary }]}>
        {summary.totalSessions} sessions completed
      </Text>
      <Text style={[styles.protocolStat, { color: colors.textSecondary }]}>
        {fmtDateRange(summary.firstDate, summary.lastDate)}
      </Text>
      <Text
        style={[
          styles.protocolGain,
          { color: summary.driverGain > 0 ? colors.accent : colors.textSecondary },
        ]}
      >
        {summary.driverGain > 0 ? '+' : ''}{summary.driverGain} mph driver speed gain
      </Text>
    </View>
  );
}

// ── Session Detail Bottom Sheet ──────────────────────────────

function SessionDetailModal({
  session,
  sessionNumber,
  colors,
  onClose,
}: {
  session: SpeedSession | null;
  sessionNumber: number;
  colors: ReturnType<typeof useColors>;
  onClose: () => void;
}) {
  if (!session) return null;

  const stickSection = (title: string, drill: 'normalStance' | 'stepDrill') => (
    <View style={styles.modalDrillSection}>
      <Text style={[styles.modalDrillTitle, { color: colors.text }]}>{title}</Text>
      <View style={styles.modalDrillHeader}>
        <View style={{ width: 80 }} />
        <Text style={[styles.modalDrillHeaderCell, { color: colors.textSecondary }]}>Dom</Text>
        <Text style={[styles.modalDrillHeaderCell, { color: colors.textSecondary }]}>Non-Dom</Text>
      </View>
      {STICK_COLORS.map((sc) => (
        <View key={sc.key} style={styles.modalDrillRow}>
          <View style={[styles.modalDrillLabel, { width: 80 }]}>
            <View style={[styles.colorDot, { backgroundColor: sc.color }]} />
            <Text style={[styles.modalDrillLabelText, { color: colors.text }]}>{sc.label}</Text>
          </View>
          <Text style={[styles.modalDrillCell, { color: colors.text }]}>
            {session[drill][sc.key].dom != null ? session[drill][sc.key].dom : '\u2014'}
          </Text>
          <Text style={[styles.modalDrillCell, { color: colors.text }]}>
            {session[drill][sc.key].nonDom != null ? session[drill][sc.key].nonDom : '\u2014'}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={[styles.modalContent, { backgroundColor: colors.background }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Session #{sessionNumber}
              </Text>
              <Text style={[styles.modalDate, { color: colors.textSecondary }]}>
                {fmtLongDate(session.date)}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {stickSection('Normal Stance', 'normalStance')}
            {stickSection('Step Drill', 'stepDrill')}

            {/* Max Out */}
            <View style={styles.modalDrillSection}>
              <Text style={[styles.modalDrillTitle, { color: colors.text }]}>Max Out</Text>
              <View style={styles.modalMaxOutRow}>
                <Text style={[styles.modalMaxOutLabel, { color: colors.textSecondary }]}>Green stick</Text>
                <Text style={[styles.modalMaxOutValue, { color: colors.text }]}>
                  {session.maxOut.green != null ? `${session.maxOut.green} mph` : '\u2014'}
                </Text>
              </View>
              <View style={styles.modalMaxOutRow}>
                <Text style={[styles.modalMaxOutLabel, { color: colors.textSecondary }]}>Driver</Text>
                <Text style={[styles.modalMaxOutValue, { color: colors.text }]}>
                  {session.maxOut.driver != null ? `${session.maxOut.driver} mph` : '\u2014'}
                </Text>
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
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

  // Section card
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

  // Color dot
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },

  // Section B: PRs
  prHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  prHeaderLabel: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  prLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 90,
  },
  prLabelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  prValue: {
    flex: 1,
    alignItems: 'center',
  },
  prMph: {
    fontSize: 18,
    fontWeight: '700',
  },
  prDate: {
    fontSize: 11,
    marginTop: 2,
  },

  // Section C: Gap
  gapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  gapLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gapLabelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  gapValue: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  gapTrend: {
    fontSize: 18,
    fontWeight: '700',
    width: 24,
    textAlign: 'center',
  },
  gapSummary: {
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },

  // Section D: Transfer
  transferMessage: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
  },
  transferStats: {
    marginTop: 8,
    gap: 4,
  },
  transferStat: {
    fontSize: 13,
  },

  // Section E: History
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 6,
  },
  historyHeaderCell: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  historyCell: {
    fontSize: 14,
  },

  // Section F: Consistency
  consistencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  consistencyCol: {
    alignItems: 'center',
    flex: 1,
  },
  consistencyBarWrap: {
    height: 80,
    justifyContent: 'flex-end',
  },
  consistencyBar: {
    width: 16,
    borderRadius: 4,
  },
  consistencyLabel: {
    fontSize: 9,
    marginTop: 4,
  },

  // Section G: Protocol
  protocolName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  protocolStat: {
    fontSize: 13,
    marginBottom: 2,
  },
  protocolGain: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalDate: {
    fontSize: 13,
    marginTop: 2,
  },
  modalDrillSection: {
    marginBottom: 20,
  },
  modalDrillTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalDrillHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  modalDrillHeaderCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalDrillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  modalDrillLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalDrillLabelText: {
    fontSize: 14,
  },
  modalDrillCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalMaxOutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  modalMaxOutLabel: {
    fontSize: 14,
  },
  modalMaxOutValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
