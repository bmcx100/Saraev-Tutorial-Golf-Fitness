import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ImageBackground,
  StyleSheet,
  AccessibilityInfo,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import {
  greenDeep,
  citron,
  cream,
  FontFamily,
  shadows,
  radii,
} from '@/constants/design-tokens';
import { DumbbellIcon } from '@/components/ui/design-icons';

// ── Props ────────────────────────────────────────────────────────

export interface BuildStrongHeroProps {
  day: number;
  totalDays: number;
  session: number;
  totalSessions: number;
  weeks: number;
  streakDays: number;
  topLift: { value: number; unit: 'lb' | 'kg' } | null;
  volumePerWeek: { value: number; display: string; unit: 'lb' | 'kg' } | null;
  weekDelta: {
    value: number;
    unit: 'lb' | 'kg';
    direction: 'up' | 'down' | 'flat';
  } | null;
  daysLeft: number;
  status: 'on-track' | 'behind' | 'ahead';
  nextSessionNumber: number;
  onPrimary: () => void;
  onPlan: () => void;
  onTap: () => void;
  onStreakTap?: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────

function formatVolume(value: number): string {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(Math.round(value));
}

const barbellImage = require('@/assets/images/buildstrong-barbell.png');

const glassBase = {
  backgroundColor: 'rgba(10,24,18,0.78)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
};

const STAGGER_DELAY = 60;
const STAGGER_DURATION = 320;

// ── Stagger animation hook ───────────────────────────────────────

function useStaggerAnim(index: number, reduceMotion: boolean) {
  const opacity = useSharedValue(reduceMotion ? 1 : 0);
  const translateY = useSharedValue(reduceMotion ? 0 : 8);

  useEffect(() => {
    if (reduceMotion) return;
    const timing = { duration: STAGGER_DURATION, easing: Easing.out(Easing.ease) };
    opacity.value = withDelay(index * STAGGER_DELAY, withTiming(1, timing));
    translateY.value = withDelay(index * STAGGER_DELAY, withTiming(0, timing));
  }, [index, reduceMotion, opacity, translateY]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

// ── Animated CTA button ──────────────────────────────────────────

function AnimatedCTA({
  label,
  variant,
  onPress,
}: {
  label: string;
  variant: 'primary' | 'secondary';
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isPrimary = variant === 'primary';

  return (
    <Animated.View
      style={[isPrimary ? s.ctaPrimaryWrap : s.ctaSecondaryWrap, animStyle]}
    >
      <Pressable
        style={isPrimary ? s.ctaPrimary : s.ctaSecondary}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.96, {
            duration: 200,
            easing: Easing.out(Easing.ease),
          });
        }}
        onPressOut={() => {
          scale.value = withTiming(1, {
            duration: 200,
            easing: Easing.out(Easing.ease),
          });
        }}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={isPrimary ? s.ctaPrimaryText : s.ctaSecondaryText}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

// ── Main Component ───────────────────────────────────────────────

export function BuildStrongHero(props: BuildStrongHeroProps) {
  const {
    day,
    totalDays,
    session,
    totalSessions,
    weeks,
    streakDays,
    topLift,
    volumePerWeek,
    weekDelta,
    daysLeft,
    status,
    nextSessionNumber,
    onPrimary,
    onPlan,
    onTap,
    onStreakTap,
  } = props;

  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => sub.remove();
  }, []);

  const isEmptyState = session === 0;
  const pillText = isEmptyState
    ? `START \u00B7 DAY 1`
    : `DAY ${day} \u00B7 SESSION ${session}`;
  const captionText = `Day ${day} / ${totalDays} \u00B7 ${weeks}-week plan`;

  const statusLabel =
    status === 'on-track'
      ? '\u2191 On track'
      : status === 'ahead'
        ? '\u2191 Ahead'
        : '\u2193 Behind';

  const deltaPrefix =
    weekDelta?.direction === 'up'
      ? '+'
      : weekDelta?.direction === 'down'
        ? '-'
        : '';
  const deltaDisplay = weekDelta
    ? `${deltaPrefix}${formatVolume(Math.abs(weekDelta.value))} ${weekDelta.unit}`
    : '\u2014';

  // Stagger animations (shared-value driven, web-safe)
  const stagger0 = useStaggerAnim(0, reduceMotion);
  const stagger1 = useStaggerAnim(1, reduceMotion);
  const stagger2 = useStaggerAnim(2, reduceMotion);
  const stagger3 = useStaggerAnim(3, reduceMotion);
  const stagger4 = useStaggerAnim(4, reduceMotion);
  const stagger5 = useStaggerAnim(5, reduceMotion);

  const accessLabel = `Build Strong program. Day ${day} of ${totalDays}. ${session} of ${totalSessions} sessions completed. ${streakDays} day streak.`;

  return (
    <View style={s.outer}>
      <ImageBackground
        source={barbellImage}
        resizeMode="cover"
        style={s.photoBackground}
        imageStyle={s.photoImage}
      >
        {/* Layer 2: Vertical forest tint */}
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
        {/* Layer 3: Diagonal green wash */}
        <LinearGradient
          colors={['rgba(29,78,52,0.33)', 'rgba(17,55,31,0.55)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Card body — tappable excluding CTAs */}
        <Pressable
          style={s.content}
          onPress={onTap}
          accessibilityRole="button"
          accessibilityLabel={accessLabel}
        >
          {/* 1. Top row */}
          <Animated.View style={[s.topRow, stagger0]}>
            <View style={s.pill}>
              <DumbbellIcon size={11} color={greenDeep} />
              <Text
                style={s.pillText}
                accessibilityElementsHidden
                importantForAccessibility="no"
              >
                {pillText}
              </Text>
            </View>
            <Text style={s.captionText}>{captionText}</Text>
          </Animated.View>

          {/* 2. Title row */}
          <Animated.View style={[s.titleRow, stagger1]}>
            <Text style={s.title} numberOfLines={1} adjustsFontSizeToFit>Build Strong.</Text>
            <Pressable
              style={s.streakBlock}
              onPress={onStreakTap}
              hitSlop={8}
              accessibilityLabel={`${streakDays} day streak`}
            >
              <Text style={s.streakNumber}>
                {streakDays}
                <Text style={s.streakUnit}>d</Text>
              </Text>
              <Text
                style={s.streakLabel}
                accessibilityElementsHidden
                importantForAccessibility="no"
              >
                STREAK
              </Text>
            </Pressable>
          </Animated.View>

          {/* 3. Stat tiles */}
          <Animated.View style={[s.tilesRow, stagger2]}>
            {/* Top lift */}
            <View style={s.tile}>
              <Text
                style={s.tileLabel}
                accessibilityElementsHidden
                importantForAccessibility="no"
              >
                TOP LIFT
              </Text>
              <Text style={s.tileValueBig}>
                {topLift ? `${topLift.value} ${topLift.unit}` : '\u2014'}
              </Text>
            </View>
            {/* Volume / wk */}
            <View style={s.tile}>
              <Text
                style={s.tileLabel}
                accessibilityElementsHidden
                importantForAccessibility="no"
              >
                VOLUME / WK
              </Text>
              <Text style={s.tileValueNormal}>
                {volumePerWeek ? `${volumePerWeek.display} ${volumePerWeek.unit}` : '\u2014'}
              </Text>
            </View>
            {/* Delta week */}
            <View style={s.tile}>
              <Text
                style={s.tileLabel}
                accessibilityElementsHidden
                importantForAccessibility="no"
              >
                {'\u0394'} WEEK
              </Text>
              <Text style={s.tileValueAccent}>{deltaDisplay}</Text>
            </View>
          </Animated.View>

          {/* 4. Progress bar */}
          <Animated.View style={[s.progressBar, stagger3]}>
            {Array.from({ length: totalSessions }).map((_, i) => (
              <View
                key={i}
                style={[
                  s.progressSeg,
                  i < session && s.progressSegFilled,
                ]}
              />
            ))}
          </Animated.View>

          {/* 5. Progress meta */}
          <Animated.View style={[s.progressMeta, stagger4]}>
            <Text style={s.metaText}>
              <Text style={s.metaHighlight}>{session}</Text>
              <Text style={s.metaDim}>/{totalSessions} sessions</Text>
            </Text>
            <Text style={[s.metaText, s.metaDaysLeft]}>
              {daysLeft} days left
            </Text>
            {!isEmptyState && (
              <Text style={[s.metaText, s.metaStatus]}>{statusLabel}</Text>
            )}
          </Animated.View>
        </Pressable>

        {/* 6. CTA row — outside the body pressable */}
        <Animated.View style={[s.ctaRow, stagger5]}>
          <AnimatedCTA
            label={`Start session ${nextSessionNumber} \u2192`}
            variant="primary"
            onPress={onPrimary}
          />
          <AnimatedCTA
            label="Plan"
            variant="secondary"
            onPress={onPlan}
          />
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────

const TEXT_SHADOW_LEGIBILITY = {
  textShadowColor: 'rgba(0,0,0,0.45)',
  textShadowOffset: { width: 0, height: 1 } as const,
  textShadowRadius: 3,
};

const s = StyleSheet.create({
  outer: {
    borderRadius: radii.cardXl,
    overflow: 'hidden' as const,
    backgroundColor: greenDeep,
    ...shadows.card,
  },
  photoBackground: {
    overflow: 'hidden' as const,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    opacity: 0.92,
  },
  content: {
    padding: 22,
    paddingBottom: 0,
  },

  // 1. Top row
  topRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  pill: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
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
  captionText: {
    fontSize: 12,
    fontFamily: FontFamily.outfitSemiBold,
    color: 'rgba(251,246,230,0.78)',
    ...TEXT_SHADOW_LEGIBILITY,
  },

  // 2. Title row
  titleRow: {
    marginTop: 12,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-end' as const,
    gap: 14,
  },
  title: {
    flex: 1,
    fontSize: 44,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: -1.54,
    lineHeight: 42,
    color: cream,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  streakBlock: {
    alignItems: 'flex-end' as const,
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'flex-end' as const,
  },
  streakNumber: {
    fontSize: 44,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: -1.54,
    lineHeight: 42,
    color: citron,
    textShadowColor: 'rgba(207,222,80,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18,
  },
  streakUnit: {
    fontSize: 24,
  },
  streakLabel: {
    marginTop: 3,
    fontSize: 13,
    fontFamily: FontFamily.monoBold,
    letterSpacing: 2.08,
    color: 'rgba(251,246,230,0.65)',
  },

  // 3. Stat tiles
  tilesRow: {
    marginTop: 16,
    flexDirection: 'row' as const,
    gap: 10,
  },
  tile: {
    flex: 1,
    ...glassBase,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tileLabel: {
    fontSize: 10,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: 1.1,
    textTransform: 'uppercase' as const,
    color: 'rgba(251,246,230,0.55)',
    marginBottom: 4,
  },
  tileValueBig: {
    fontSize: 18,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: -0.36,
    color: citron,
  },
  tileValueNormal: {
    fontSize: 14,
    fontFamily: FontFamily.outfitBold,
    letterSpacing: -0.14,
    color: cream,
  },
  tileValueAccent: {
    fontSize: 14,
    fontFamily: FontFamily.outfitBold,
    letterSpacing: -0.14,
    color: citron,
  },

  // 4. Progress bar
  progressBar: {
    marginTop: 16,
    flexDirection: 'row' as const,
    gap: 3,
  },
  progressSeg: {
    flex: 1,
    height: 12,
    borderRadius: radii.progressSeg,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  progressSegFilled: {
    backgroundColor: citron,
    shadowColor: citron,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },

  // 5. Progress meta
  progressMeta: {
    marginTop: 10,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  metaText: {
    fontSize: 12,
    fontFamily: FontFamily.outfitSemiBold,
    color: cream,
    ...TEXT_SHADOW_LEGIBILITY,
  },
  metaHighlight: {
    fontFamily: FontFamily.outfitExtraBold,
    color: citron,
  },
  metaDim: {
    opacity: 0.7,
  },
  metaDaysLeft: {
    opacity: 0.75,
  },
  metaStatus: {
    fontFamily: FontFamily.outfitBold,
    color: citron,
  },

  // 6. CTA row
  ctaRow: {
    flexDirection: 'row' as const,
    gap: 10,
    paddingHorizontal: 22,
    paddingBottom: 22,
    marginTop: 18,
  },
  ctaPrimaryWrap: {
    flex: 1,
  },
  ctaPrimary: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: citron,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...shadows.cta,
  },
  ctaPrimaryText: {
    fontSize: 14,
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: -0.14,
    color: greenDeep,
  },
  ctaSecondaryWrap: {},
  ctaSecondary: {
    padding: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    ...glassBase,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  ctaSecondaryText: {
    fontSize: 14,
    fontFamily: FontFamily.outfitBold,
    letterSpacing: -0.14,
    color: cream,
  },
});
