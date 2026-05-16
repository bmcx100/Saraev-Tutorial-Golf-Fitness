import { useEffect, useRef } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { forest, greenDeep, sub, citron, FontFamily } from '@/constants/design-tokens';

interface SpeedCellProps {
  label: string;
  value: number | null;
  focused: boolean;
  muted: boolean;
  accentColor: string;
  variant: 'small' | 'large';
  onPress: () => void;
  prValue?: number;
}

export function SpeedCell({
  label,
  value,
  focused,
  muted,
  accentColor,
  variant,
  onPress,
  prValue,
}: SpeedCellProps) {
  const filled = value !== null;
  const isLarge = variant === 'large';
  const isNewPR = prValue != null && value != null && value > prValue;

  // Pulse animation for PR crossing
  const scale = useSharedValue(1);
  const prCelebratedRef = useRef(false);

  useEffect(() => {
    if (isNewPR && !prCelebratedRef.current) {
      prCelebratedRef.current = true;
      scale.value = withSequence(
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 }),
      );
      if (process.env.EXPO_OS === 'ios') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } else if (!isNewPR) {
      prCelebratedRef.current = false;
    }
  }, [isNewPR, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const borderStyle = focused
    ? { borderWidth: 2, borderStyle: 'solid' as const, borderColor: isNewPR ? citron : forest }
    : muted
      ? { borderWidth: 1, borderStyle: 'dashed' as const, borderColor: '#e2dcc0' }
      : { borderWidth: 1, borderStyle: 'dashed' as const, borderColor: accentColor + '66' };

  const bgColor = focused ? accentColor + '15' : 'transparent';
  const numberColor = filled || focused ? greenDeep : 'rgba(14,33,24,0.22)';
  const mphColor = muted ? 'rgba(107,117,111,0.7)' : sub;

  // PR label
  const showPR = prValue != null && !muted;
  const prLabel = isNewPR ? 'NEW PR' : `PR: ${prValue}`;
  const prColor = isNewPR ? citron : sub;

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        style={[
          styles.container,
          {
            backgroundColor: bgColor,
            borderRadius: isLarge ? 12 : 10,
            padding: isLarge ? 14 : 7,
            paddingHorizontal: isLarge ? 10 : 4,
          },
          borderStyle,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${label} ${filled ? `${value} mph` : 'empty'}`}
        accessibilityState={{ selected: focused }}
      >
        <Text
          style={[
            styles.label,
            {
              fontSize: isLarge ? 9 : 8,
              letterSpacing: isLarge ? 9 * 0.24 : 8 * 0.22,
            },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.number,
            {
              color: numberColor,
              fontSize: isLarge ? 40 : 19,
              letterSpacing: isLarge ? -0.025 * 40 : -0.02 * 19,
              lineHeight: isLarge ? 40 : 21,
            },
          ]}
        >
          {filled ? String(value) : isLarge ? '———' : '——'}
        </Text>
        <Text
          style={[
            styles.mph,
            {
              color: mphColor,
              fontSize: isLarge ? 9 : 8,
              letterSpacing: isLarge ? 9 * 0.1 : 8 * 0.08,
            },
          ]}
        >
          mph
        </Text>
        {showPR && (
          <Text
            style={[
              styles.prLabel,
              {
                color: prColor,
                fontWeight: isNewPR ? '700' : '400',
              },
            ]}
          >
            {prLabel}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0,
  },
  label: {
    fontFamily: FontFamily.monoBold,
    color: sub,
    textTransform: 'uppercase',
  },
  number: {
    fontFamily: FontFamily.monoBold,
    fontVariant: ['tabular-nums'],
  },
  mph: {
    fontFamily: FontFamily.monoSemiBold,
  },
  prLabel: {
    fontFamily: FontFamily.monoBold,
    fontSize: 11,
    marginTop: 2,
  },
});
