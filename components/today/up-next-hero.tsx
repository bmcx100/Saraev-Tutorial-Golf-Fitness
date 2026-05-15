import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import {
  forest, greenDeep, citron, cream, G8,
  FontFamily, shadows,
} from '@/constants/design-tokens';
import { BoltIcon, FlagFillIcon, PlayIcon } from '@/components/ui/design-icons';
import { TopoBackground } from './topo-background';
import type { Habit } from '@/constants/habits';

interface UpNextHeroProps {
  habit: Habit;
  /** e.g. "6 x 3 sets · L / R" */
  subtitle: string;
  /** Which item in the queue (1-based) */
  queuePosition: number;
  queueTotal: number;
  /** Active challenge name, if any */
  challengeName?: string;
  /** Session N out of totalSessions */
  challengeSessionCurrent?: number;
  challengeSessionTotal?: number;
  /** Days remaining on challenge */
  challengeDaysLeft?: number;
  onStartPress: () => void;
}

/**
 * Forest gradient hero card for the "Up Next" habit.
 */
export function UpNextHero({
  habit,
  subtitle,
  queuePosition,
  queueTotal,
  challengeName,
  challengeSessionCurrent,
  challengeSessionTotal,
  challengeDaysLeft,
  onStartPress,
}: UpNextHeroProps) {
  return (
    <View style={styles.outer}>
      <LinearGradient
        colors={[forest, greenDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Inner topo lines */}
        <TopoBackground tint={citron} opacity={0.18} viewBoxHeight={280} />

        {/* Ball-tracer arc */}
        <Svg
          style={styles.ballTracer}
          width={360}
          height={200}
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
        >
          <Path
            d="M 4 86 Q 90 0, 196 14"
            fill="none"
            stroke={G8}
            strokeWidth={6}
            strokeLinecap="round"
            opacity={0.18}
          />
          <Path
            d="M 4 86 Q 90 0, 196 14"
            fill="none"
            stroke={G8}
            strokeWidth={2.2}
            strokeLinecap="round"
            opacity={0.95}
          />
          <Path
            d="M 4 91 Q 93 3, 196 26"
            fill="none"
            stroke={G8}
            strokeWidth={1.3}
            strokeLinecap="round"
            opacity={0.62}
            strokeDasharray="3 7"
          />
          <Path
            d="M 4 90 Q 100 -2, 196 21"
            fill="none"
            stroke={G8}
            strokeWidth={1.2}
            strokeLinecap="round"
            opacity={0.55}
            strokeDasharray="2 5"
          />
        </Svg>

        {/* Top row: UP NEXT pill + position counter */}
        <View style={styles.topRow}>
          <View style={styles.upNextPill}>
            <BoltIcon size={11} color={greenDeep} />
            <Text style={styles.upNextText}>
              UP NEXT · {habit.durationMinutes ?? 12} MIN
            </Text>
          </View>
          <Text style={styles.positionText}>
            {queuePosition} of {queueTotal}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{habit.name}.</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        {/* Challenge progress strip (if challenge active) */}
        {challengeName && challengeSessionTotal && (
          <View style={styles.progressStrip}>
            <FlagFillIcon size={14} color={citron} />
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>
                {challengeName} · session {challengeSessionCurrent ?? 0} / {challengeSessionTotal}
              </Text>
              <View style={styles.progressBarRow}>
                {Array.from({ length: challengeSessionTotal }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.progressSegment,
                      i < (challengeSessionCurrent ?? 0) && styles.progressSegmentFilled,
                    ]}
                  />
                ))}
              </View>
            </View>
            {challengeDaysLeft != null && (
              <Text style={styles.daysLeft}>{challengeDaysLeft}d</Text>
            )}
          </View>
        )}

        {/* CTA */}
        <Pressable style={styles.cta} onPress={onStartPress}>
          <PlayIcon size={14} color={greenDeep} />
          <Text style={styles.ctaText}>Start now</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 28,
    overflow: 'hidden',
    ...shadows.card,
  },
  gradient: {
    padding: 20,
    paddingHorizontal: 22,
    paddingBottom: 22,
    position: 'relative',
  },
  ballTracer: {
    position: 'absolute',
    top: -16,
    right: 0,
  },
  topRow: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upNextPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: citron,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  upNextText: {
    fontSize: 11,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: 0.44,
    color: greenDeep,
  },
  positionText: {
    fontSize: 11.5,
    fontFamily: FontFamily.monoBold,
    color: cream,
    opacity: 0.78,
  },
  title: {
    position: 'relative',
    marginTop: 14,
    fontSize: 44,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: -1.76,
    lineHeight: 40,
    color: cream,
  },
  subtitle: {
    position: 'relative',
    marginTop: 4,
    fontSize: 13,
    fontFamily: FontFamily.outfitMedium,
    color: cream,
    opacity: 0.7,
  },
  progressStrip: {
    position: 'relative',
    marginTop: 16,
    padding: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: FontFamily.outfitBold,
    color: cream,
    opacity: 0.65,
    letterSpacing: 0.66,
    textTransform: 'uppercase',
  },
  progressBarRow: {
    marginTop: 5,
    flexDirection: 'row',
    gap: 3,
  },
  progressSegment: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  progressSegmentFilled: {
    backgroundColor: citron,
  },
  daysLeft: {
    fontSize: 12,
    fontFamily: FontFamily.monoExtraBold,
    color: citron,
  },
  cta: {
    position: 'relative',
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: citron,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...shadows.cta,
  },
  ctaText: {
    fontSize: 16,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: -0.16,
    color: greenDeep,
  },
});
