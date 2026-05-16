import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {
  ink,
  forest,
  greenDeep,
  citron,
  paper,
  rule,
  FontFamily,
  subtitleText,
} from '@/constants/design-tokens';
import type { CardTone } from '@/utils/strength-helpers';
export type { CardTone } from '@/utils/strength-helpers';
export { deriveTone } from '@/utils/strength-helpers';

interface ExerciseCardProps {
  name: string;
  weight: number | null;
  reps: number;
  done: number;
  total: number;
  tone: CardTone;
  onLogSet: () => void;
  onEditWeight: () => void;
  onEditReps: () => void;
}

// ── Check Icon (stroke 3 per spec) ──────────────────────────

function CheckIcon({ size = 14, color = greenDeep }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="m5 12 5 5L20 7"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ── Dot Progress ─────────────────────────────────────────────

function DotProgress({
  done,
  total,
  tone,
}: {
  done: number;
  total: number;
  tone: CardTone;
}) {
  return (
    <View style={dotStyles.row}>
      {Array.from({ length: total }).map((_, i) => {
        const isCompleted = i < done;
        const isNextDot = tone === 'next' && i === done;
        return (
          <View
            key={i}
            style={[
              dotStyles.dot,
              {
                width: isCompleted ? 14 : 7,
                backgroundColor: isCompleted
                  ? citron
                  : isNextDot
                    ? forest
                    : 'rgba(14,33,24,0.15)',
              },
              isCompleted && dotStyles.dotGlow,
            ]}
          />
        );
      })}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dot: {
    height: 7,
    borderRadius: 99,
  },
  dotGlow: {
    shadowColor: citron,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 2,
  },
});

// ── Value Pill ───────────────────────────────────────────────

function ValuePill({
  value,
  unit,
  label,
  tone,
  onPress,
}: {
  value: number | null;
  unit: string;
  label: string;
  tone: CardTone;
  onPress: () => void;
}) {
  const pillTone = tone === 'next' ? 'next' : tone === 'done' ? 'done' : 'idle';

  return (
    <Pressable onPress={onPress} style={[pillStyles.pill, pillToneStyles[pillTone]]}>
      <Text style={pillStyles.label}>{label}</Text>
      <View style={pillStyles.valueRow}>
        <Text style={[pillStyles.value, { color: pillValueColors[pillTone] }]}>
          {value ?? '--'}
        </Text>
        <Text style={pillStyles.unit}>{unit}</Text>
      </View>
    </Pressable>
  );
}

const pillValueColors: Record<string, string> = {
  idle: 'rgba(14,33,24,0.55)',
  next: greenDeep,
  done: greenDeep,
};

const pillToneStyles = StyleSheet.create({
  idle: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: rule,
  },
  next: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: forest,
    shadowColor: greenDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  done: {
    backgroundColor: paper,
    borderWidth: 1,
    borderColor: rule,
  },
});

const pillStyles = StyleSheet.create({
  pill: {
    minWidth: 64,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 0,
  },
  label: {
    fontFamily: FontFamily.monoBold,
    fontSize: 9,
    letterSpacing: 9 * 0.18,
    color: subtitleText,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  value: {
    fontFamily: FontFamily.monoBold,
    fontSize: 19,
    letterSpacing: -0.02 * 19,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontFamily: FontFamily.monoSemiBold,
    fontSize: 9.5,
    letterSpacing: 0.04 * 9.5,
    color: subtitleText,
  },
});

// ── Log Set Button ───────────────────────────────────────────

function LogSetButton({
  label,
  tone,
  onPress,
}: {
  label: string;
  tone: CardTone;
  onPress: () => void;
}) {
  if (tone === 'done') {
    return (
      <View style={btnStyles.done}>
        <CheckIcon size={14} color={greenDeep} />
        <Text style={btnStyles.doneText}>{label}</Text>
      </View>
    );
  }

  const isNext = tone === 'next';

  return (
    <Pressable onPress={onPress} style={[btnStyles.btn, isNext ? btnStyles.btnNext : btnStyles.btnIdle]}>
      <Text style={[btnStyles.btnText, isNext ? btnStyles.btnTextNext : btnStyles.btnTextIdle]}>
        {label}
      </Text>
      {isNext && <Text style={btnStyles.arrow}>{'\u2192'}</Text>}
    </Pressable>
  );
}

const btnStyles = StyleSheet.create({
  btn: {
    flex: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnNext: {
    backgroundColor: citron,
    paddingVertical: 13,
    paddingHorizontal: 14,
    shadowColor: citron,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 22,
    elevation: 6,
  },
  btnIdle: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: rule,
  },
  btnText: {
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: -0.01 * 15,
  },
  btnTextNext: {
    fontSize: 15,
    color: greenDeep,
  },
  btnTextIdle: {
    fontSize: 13,
    color: forest,
  },
  arrow: {
    fontFamily: FontFamily.monoExtraBold,
    fontSize: 14,
    color: greenDeep,
    marginLeft: 2,
  },
  done: {
    flex: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(207,222,80,0.20)',
    borderWidth: 1,
    borderColor: citron,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  doneText: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 13,
    color: greenDeep,
  },
});

// ── Exercise Card ────────────────────────────────────────────

export function ExerciseCard({
  name,
  weight,
  reps,
  done,
  total,
  tone,
  onLogSet,
  onEditWeight,
  onEditReps,
}: ExerciseCardProps) {
  const isActive = tone === 'next';
  const isDone = tone === 'done';
  const pulseScale = useSharedValue(1);

  const label =
    isDone
      ? `${total} of ${total} done`
      : isActive
        ? `Log Set ${done + 1}`
        : `Log Set 1`;

  const handleLogSet = () => {
    // Citron pulse animation
    pulseScale.value = withSequence(
      withTiming(1.015, { duration: 160, easing: Easing.inOut(Easing.ease) }),
      withTiming(1, { duration: 160, easing: Easing.inOut(Easing.ease) }),
    );
    onLogSet();
  };

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <Animated.View
      style={[
        cardStyles.card,
        isActive && cardStyles.cardNext,
        !isActive && !isDone && cardStyles.cardIdle,
        isDone && cardStyles.cardDone,
        pulseStyle,
      ]}
    >
      {/* NOW badge */}
      {isActive && (
        <View style={cardStyles.badge}>
          <Text style={cardStyles.badgeText}>
            NOW {'\u00B7'} SET {done + 1}
          </Text>
        </View>
      )}

      {/* Row 1: title + dots */}
      <View style={cardStyles.headerRow}>
        <View style={cardStyles.headerLeft}>
          <Text
            style={[
              cardStyles.cardTitle,
              { fontSize: isActive ? 17 : 15.5 },
            ]}
            numberOfLines={1}
          >
            {name}
          </Text>
          {isActive && <Text style={cardStyles.subtitle}>TAP A VALUE TO ADJUST</Text>}
        </View>
        <DotProgress done={done} total={total} tone={tone} />
      </View>

      {/* Row 2: pills + CTA */}
      <View style={cardStyles.controlsRow}>
        <ValuePill
          value={weight}
          unit="lb"
          label="WEIGHT"
          tone={tone}
          onPress={onEditWeight}
        />
        <ValuePill
          value={reps}
          unit="reps"
          label="REPS"
          tone={tone}
          onPress={onEditReps}
        />
        <LogSetButton tone={tone} label={label} onPress={handleLogSet} />
      </View>
    </Animated.View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 18,
    flexDirection: 'column',
    gap: 10,
    position: 'relative',
  },
  cardIdle: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: rule,
    padding: 12,
    paddingHorizontal: 14,
    shadowColor: greenDeep,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 0,
    elevation: 1,
  },
  cardNext: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: citron,
    padding: 14,
    transform: [{ translateY: -1 }],
    // Three stacked shadows — RN uses the outermost shadow:
    // halo (4px spread via shadowRadius) + lift (18px) + soft (4px)
    shadowColor: greenDeep,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    elevation: 8,
  },
  cardDone: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: rule,
    padding: 12,
    paddingHorizontal: 14,
    opacity: 0.78,
  },
  badge: {
    position: 'absolute',
    top: -10,
    left: 14,
    backgroundColor: citron,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 99,
    zIndex: 10,
    shadowColor: citron,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 4,
  },
  badgeText: {
    fontFamily: FontFamily.monoExtraBold,
    fontSize: 9,
    letterSpacing: 9 * 0.2,
    color: greenDeep,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    fontFamily: FontFamily.outfitExtraBold,
    letterSpacing: -0.018 * 16,
    lineHeight: 16 * 1.1,
    color: ink,
  },
  subtitle: {
    fontFamily: FontFamily.monoBold,
    fontSize: 10,
    letterSpacing: 10 * 0.16,
    color: forest,
    marginTop: 3,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
  },
});

