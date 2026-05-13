import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useColors } from '@/hooks/use-colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface CategoryRingData {
  key: string;
  label: string;
  color: string;
  progress: number; // 0–1
}

interface FitnessRingsProps {
  rings: CategoryRingData[];
  size?: number;
}

export function FitnessRings({ rings, size = 200 }: FitnessRingsProps) {
  const colors = useColors();
  const center = size / 2;
  const ringWidth = 12;
  const ringGap = 4;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {rings.map((ring, i) => {
          const radius = center - ringWidth / 2 - i * (ringWidth + ringGap);
          if (radius <= 0) return null;
          const circumference = 2 * Math.PI * radius;

          return (
            <RingLayer
              key={ring.key}
              cx={center}
              cy={center}
              radius={radius}
              circumference={circumference}
              progress={ring.progress}
              color={ring.color}
              trackColor={colors.ringBackground}
              strokeWidth={ringWidth}
            />
          );
        })}
      </Svg>
      <View style={styles.legend}>
        {rings.map((ring) => (
          <View key={ring.key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: ring.color }]} />
            <Text style={[styles.legendText, { color: colors.text }]} numberOfLines={1}>
              {ring.label}
            </Text>
            <Text style={[styles.legendStatus, { color: colors.textSecondary }]}>
              {ring.progress >= 1 ? 'Done' : `${Math.round(ring.progress * 100)}%`}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

interface RingLayerProps {
  cx: number;
  cy: number;
  radius: number;
  circumference: number;
  progress: number;
  color: string;
  trackColor: string;
  strokeWidth: number;
}

function RingLayer({
  cx,
  cy,
  radius,
  circumference,
  progress,
  color,
  trackColor,
  strokeWidth,
}: RingLayerProps) {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withSpring(Math.min(progress, 1), {
      damping: 15,
      stiffness: 80,
    });
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  return (
    <>
      {/* Track */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Fill */}
      <AnimatedCircle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        animatedProps={animatedProps}
        rotation={-90}
        origin={`${cx}, ${cy}`}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  legend: {
    gap: 6,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    flex: 1,
    fontSize: 14,
  },
  legendStatus: {
    fontSize: 13,
    fontWeight: '600',
  },
});
