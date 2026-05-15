import { View, Text, StyleSheet } from 'react-native';
import {
  G8, G9, forest, greenDeep, citron,
  FontFamily, shadows,
} from '@/constants/design-tokens';
import { ConcentricRings } from './concentric-rings';
import { FlagFillIcon } from '@/components/ui/design-icons';

interface RingCardProps {
  challengeName: string;
  dayNumber: number;
  /** How many categories remain incomplete */
  remaining: number;
  /** Category labels for subtitle, e.g. ["Golf", "Workouts", "Lifestyle"] */
  categoryLabels: string[];
  /** Progress count (completed) */
  progress: number;
  /** Target total */
  target: number;
  /** Ring percentages [golf, workout, lifestyle] — 0 to 1 */
  ringPcts: [number, number, number];
}

/**
 * G8-background card showing active challenge status with concentric rings.
 */
export function RingCard({
  challengeName,
  dayNumber,
  remaining,
  categoryLabels,
  progress,
  target,
  ringPcts,
}: RingCardProps) {
  return (
    <View style={styles.container}>
      {/* Big G9 disc — bleeds off top + right */}
      <View style={styles.disc} />

      <View style={styles.ringsWrap}>
        <ConcentricRings size={76} strokeWidth={7} pcts={ringPcts} />
      </View>

      <View style={styles.info}>
        <View style={styles.pill}>
          <FlagFillIcon size={9} color={greenDeep} />
          <Text style={styles.pillText}>
            DAY {dayNumber} · ACTIVE
          </Text>
        </View>
        <Text style={styles.title}>{challengeName}</Text>
        <Text style={styles.subtitle}>
          {remaining} left · {categoryLabels.join(' · ')}
        </Text>
      </View>

      <View style={styles.counter}>
        <Text style={styles.counterNumber}>{progress}</Text>
        <Text style={styles.counterLabel}>OF {target}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: G8,
    borderRadius: 24,
    padding: 16,
    paddingHorizontal: 18,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.g8,
  },
  disc: {
    position: 'absolute',
    right: -90,
    top: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: G9,
  },
  ringsWrap: {
    position: 'relative',
  },
  info: {
    position: 'relative',
    flex: 1,
    marginLeft: 14,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: citron,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  pillText: {
    fontSize: 10,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: 0.6,
    color: greenDeep,
  },
  title: {
    marginTop: 6,
    fontSize: 22,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: -0.66,
    lineHeight: 22,
    color: forest,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 12,
    fontFamily: FontFamily.outfitSemiBold,
    color: 'rgba(14,33,24,0.65)',
  },
  counter: {
    position: 'relative',
    alignItems: 'flex-end',
    gap: 2,
  },
  counterNumber: {
    fontFamily: FontFamily.monoExtraBold,
    fontSize: 22,
    color: forest,
  },
  counterLabel: {
    fontFamily: FontFamily.monoBold,
    fontSize: 9,
    color: 'rgba(14,33,24,0.6)',
    letterSpacing: 0.45,
  },
});
