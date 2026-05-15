import { View, Text, Pressable, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import {
  forest, greenDeep, citron, cream, G8, G2,
  FontFamily, shadows, radii,
} from '@/constants/design-tokens';
import { BoltIcon, DumbbellIcon, FlagFillIcon, PlayIcon } from '@/components/ui/design-icons';
import { TopoBackground } from './topo-background';
import type { Habit } from '@/constants/habits';
import type { StrengthHeroData } from '@/hooks/use-strength-hero-stats';

export type HeroVariant = 'speed' | 'strength' | 'default';

interface UpNextHeroProps {
  habit: Habit;
  /** e.g. "6 x 3 sets · L / R" */
  subtitle: string;
  /** Which item in the queue (1-based) */
  queuePosition: number;
  queueTotal: number;
  /** 'speed' | 'strength' | 'default' */
  variant?: HeroVariant;
  /** Active challenge name, if any */
  challengeName?: string;
  /** Session N out of totalSessions */
  challengeSessionCurrent?: number;
  challengeSessionTotal?: number;
  /** Days remaining on challenge */
  challengeDaysLeft?: number;
  /** Challenge day number (1-based) */
  challengeDayNumber?: number;
  /** Strength stats for the Build Strong card */
  strengthData?: StrengthHeroData;
  onStartPress: () => void;
  onPlanPress?: () => void;
}

const barbellImage = require('@/assets/images/buildstrong-barbell.png');

function BallTracerSvg() {
  return (
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
  );
}

function HeroContent({
  habit,
  subtitle,
  queuePosition,
  queueTotal,
  variant = 'default',
  challengeName,
  challengeSessionCurrent,
  challengeSessionTotal,
  challengeDaysLeft,
  onStartPress,
}: UpNextHeroProps) {
  const PillIcon = variant === 'strength' ? DumbbellIcon : BoltIcon;

  return (
    <>
      {/* Top row: UP NEXT pill + position counter */}
      <View style={styles.topRow}>
        <View style={styles.upNextPill}>
          <PillIcon size={11} color={greenDeep} />
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
    </>
  );
}

// ── Strength hero helpers ─────────────────────────────────────

function formatDelta(d: number): string {
  const prefix = d > 0 ? '+' : '';
  const abs = Math.abs(d);
  if (abs >= 1000) {
    const k = d / 1000;
    return `${prefix}${parseFloat(k.toFixed(1))}k`;
  }
  return `${prefix}${Math.round(d)}`;
}

// ── Strength hero content (BS6-M · Standard) ────────────────

function StrengthHeroContent({
  queuePosition,
  queueTotal,
  challengeSessionCurrent,
  challengeSessionTotal,
  challengeDaysLeft,
  challengeDayNumber,
  strengthData: sd,
}: UpNextHeroProps) {
  const hasChallengeProgress = challengeSessionTotal != null && challengeSessionTotal > 0;

  // Pill text: show day + workout label when challenge active
  const pillText = hasChallengeProgress && challengeDayNumber
    ? `DAY ${challengeDayNumber} \u00B7 ${sd?.nextWorkoutLabel ?? 'STRENGTH'}`
    : sd?.nextWorkoutLabel ?? 'STRENGTH';

  // Counter text: "Day X / totalDays" when challenge, else queue position
  const totalDays = hasChallengeProgress
    ? (challengeDayNumber ?? 0) + (challengeDaysLeft ?? 0)
    : 0;
  const counterText = hasChallengeProgress
    ? `Day ${challengeDayNumber} / ${totalDays}`
    : `${queuePosition} of ${queueTotal}`;

  return (
    <>
      {/* Top row: pill + counter */}
      <View style={bs.topRow}>
        <View style={bs.pill}>
          <DumbbellIcon size={11} color={greenDeep} />
          <Text style={bs.pillText}>{pillText}</Text>
        </View>
        <Text style={bs.counterText}>{counterText}</Text>
      </View>

      {/* Title + Streak readout */}
      <View style={bs.titleRow}>
        <View style={bs.titleBlock}>
          <Text style={bs.title}>Build Strong.</Text>
          <Text style={bs.subtitle}>
            {sd?.nextWorkoutSubtitle ?? 'Resistance + injury\u00A0prevention'}
            {hasChallengeProgress ? ` \u00B7 ${challengeSessionTotal} sessions` : ''}
          </Text>
        </View>
        {sd != null && sd.streak > 0 && (
          <View style={bs.streakBlock}>
            <Text style={bs.streakNumber}>
              {sd.streak}
              <Text style={bs.streakUnit}>d</Text>
            </Text>
            <Text style={bs.streakLabel}>STREAK</Text>
          </View>
        )}
      </View>

      {/* Segmented progress bar (challenge active) */}
      {hasChallengeProgress && (
        <>
          <View style={bs.progressBar}>
            {Array.from({ length: challengeSessionTotal }).map((_, i) => (
              <View
                key={i}
                style={[
                  bs.progressSegment,
                  i < (challengeSessionCurrent ?? 0) && bs.progressSegmentFilled,
                ]}
              />
            ))}
          </View>
          <View style={bs.progressFooter}>
            <Text style={bs.progressText}>
              <Text style={bs.progressHighlight}>
                {challengeSessionCurrent ?? 0}
              </Text>
              <Text style={bs.progressDim}>
                /{challengeSessionTotal} sessions
              </Text>
            </Text>
            {challengeDaysLeft != null && (
              <Text style={[bs.progressText, bs.progressDim]}>
                {challengeDaysLeft} days left
              </Text>
            )}
            {sd?.volumeDelta != null ? (
              <Text style={[bs.progressText, bs.progressAccent]}>
                {'\u2191'} {formatDelta(sd.volumeDelta)} lb
              </Text>
            ) : (
              <Text style={[bs.progressText, bs.progressAccent]}>
                {'\u2191'} On track
              </Text>
            )}
          </View>
        </>
      )}
    </>
  );
}

// ── Main export ──────────────────────────────────────────────

/**
 * Themed hero card for the "Up Next" habit.
 * - speed / default: forest gradient + ball tracer + topo
 * - strength: barbell photo + forest tint overlays (BS6-M)
 */
export function UpNextHero(props: UpNextHeroProps) {
  const { variant = 'default' } = props;

  if (variant === 'strength') {
    return (
      <Pressable
        style={[styles.outer, styles.strengthBase]}
        onPress={props.onStartPress}
      >
        <ImageBackground
          source={barbellImage}
          resizeMode="cover"
          style={styles.photoBackground}
          imageStyle={styles.photoImage}
        >
          {/* Vertical forest tint: 180deg, forest-toned stops */}
          <LinearGradient
            colors={[
              'rgba(10,24,18,0.78)',
              'rgba(17,55,31,0.62)',
              'rgba(17,55,31,0.48)',
              'rgba(17,55,31,0.72)',
            ]}
            locations={[0, 0.4, 0.7, 1]}
            style={StyleSheet.absoluteFill}
          />
          {/* Diagonal green wash: 135deg, G3@33 → G2@55 */}
          <LinearGradient
            colors={['rgba(29,78,52,0.33)', 'rgba(17,55,31,0.55)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={bs.content}>
            <StrengthHeroContent {...props} />
          </View>
        </ImageBackground>
      </Pressable>
    );
  }

  // speed / default: forest gradient + ball tracer + topo
  return (
    <View style={styles.outer}>
      <LinearGradient
        colors={[forest, greenDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <TopoBackground tint={citron} opacity={0.18} viewBoxHeight={280} />
        <BallTracerSvg />
        <HeroContent {...props} />
      </LinearGradient>
    </View>
  );
}

// ── Shared styles (speed / default) ─────────────────────────

const styles = StyleSheet.create({
  outer: {
    borderRadius: radii.cardL,
    overflow: 'hidden',
    ...shadows.card,
  },
  gradient: {
    padding: 20,
    paddingHorizontal: 22,
    paddingBottom: 22,
    position: 'relative',
  },
  strengthBase: {
    backgroundColor: G2,
    borderRadius: radii.cardM,
  },
  photoBackground: {
    overflow: 'hidden',
  },
  photoImage: {
    opacity: 0.92,
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

// ── Strength styles (BS6-M · Standard) ──────────────────────

const bs = StyleSheet.create({
  content: {
    padding: 18,
    paddingHorizontal: 20,
    position: 'relative',
  },
  // Top row
  topRow: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: citron,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  pillText: {
    fontSize: 11,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: 0.44,
    color: greenDeep,
  },
  counterText: {
    fontSize: 12,
    fontFamily: FontFamily.outfitSemiBold,
    color: 'rgba(251,246,230,0.78)',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Title + Streak
  titleRow: {
    position: 'relative',
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 14,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 40,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: -1.4,
    lineHeight: 38,
    color: cream,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12.5,
    fontFamily: FontFamily.outfitMedium,
    color: 'rgba(251,246,230,0.78)',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  streakBlock: {
    alignItems: 'flex-end' as const,
  },
  streakNumber: {
    fontSize: 32,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: -1.12,
    lineHeight: 32,
    color: citron,
    textShadowColor: 'rgba(207,222,80,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  streakUnit: {
    fontSize: 18,
  },
  streakLabel: {
    marginTop: 3,
    fontSize: 11,
    fontFamily: FontFamily.monoBold,
    letterSpacing: 1.76,
    color: 'rgba(251,246,230,0.65)',
  },
  // Segmented progress bar
  progressBar: {
    position: 'relative',
    marginTop: 14,
    flexDirection: 'row',
    gap: 3,
  },
  progressSegment: {
    flex: 1,
    height: 9,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  progressSegmentFilled: {
    backgroundColor: citron,
    shadowColor: citron,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  progressFooter: {
    position: 'relative',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    fontFamily: FontFamily.outfitSemiBold,
    color: cream,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressHighlight: {
    fontFamily: FontFamily.outfitExtraBold,
    color: citron,
  },
  progressDim: {
    opacity: 0.7,
  },
  progressAccent: {
    fontFamily: FontFamily.outfitBold,
    color: citron,
  },
});
