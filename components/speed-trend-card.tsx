import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { useColors } from '@/hooks/use-colors';
import type { DriverSpeedEntry } from '@/hooks/use-training-history';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface SpeedTrendCardProps {
  driverSpeeds: DriverSpeedEntry[];
  latestDriverSpeed: number | null;
  bestDriverSpeed: number | null;
  colors: ReturnType<typeof useColors>;
}

export function SpeedTrendCard({
  driverSpeeds,
  latestDriverSpeed,
  bestDriverSpeed,
  colors,
}: SpeedTrendCardProps) {
  const hasData = latestDriverSpeed != null;
  const last7 = driverSpeeds.slice(-7);
  const maxInRow = last7.length > 0 ? Math.max(...last7.map((d) => d.mph)) : 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        Driver Speed
      </Text>

      {hasData ? (
        <>
          <Text style={[styles.heroNumber, { color: colors.text }]}>
            {latestDriverSpeed}
          </Text>
          <Text style={[styles.heroUnit, { color: colors.textSecondary }]}>
            mph
          </Text>
          <Text style={[styles.bestText, { color: colors.textSecondary }]}>
            Best: {bestDriverSpeed} mph
          </Text>

          {last7.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendRow}
            >
              {last7.map((entry) => {
                const dayLabel =
                  DAY_LABELS[new Date(entry.date + 'T00:00:00').getDay()];
                const isMax = entry.mph === maxInRow;
                return (
                  <View
                    key={entry.date}
                    style={[styles.pill, { backgroundColor: colors.background }]}
                  >
                    <Text
                      style={[
                        styles.pillDay,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {dayLabel}
                    </Text>
                    <Text
                      style={[
                        styles.pillValue,
                        { color: isMax ? colors.tint : colors.text },
                      ]}
                    >
                      {entry.mph}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </>
      ) : (
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Complete a speed session to see your{'\u00A0'}trends here
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  heroNumber: {
    fontSize: 48,
    fontWeight: '800',
    lineHeight: 52,
  },
  heroUnit: {
    fontSize: 15,
    marginBottom: 4,
  },
  bestText: {
    fontSize: 14,
    marginBottom: 16,
  },
  trendRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 52,
  },
  pillDay: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  pillValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 15,
    marginTop: 8,
  },
});
