import { useEffect } from 'react';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { forest, clay, flax, ringTrack } from '@/constants/design-tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ConcentricRingsProps {
  size?: number;
  strokeWidth?: number;
  gap?: number;
  /** Progress percentages [outer, middle, inner] — 0 to 1 */
  pcts?: [number, number, number];
  colors?: [string, string, string];
  trackColor?: string;
}

/**
 * Three concentric progress rings, per the v3b design.
 * Outer = golf (forest), middle = workout (clay), inner = lifestyle (flax).
 */
export function ConcentricRings({
  size = 76,
  strokeWidth = 7,
  gap = 2,
  pcts = [0, 0, 0],
  colors = [forest, clay, flax],
  trackColor = ringTrack,
}: ConcentricRingsProps) {
  const center = size / 2;
  const r1 = (size - strokeWidth) / 2;
  const r2 = r1 - strokeWidth - gap;
  const r3 = r2 - strokeWidth - gap;
  const radii = [r1, r2, r3];

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {radii.map((r, i) => {
        if (r <= 0) return null;
        const circumference = 2 * Math.PI * r;
        return (
          <RingLayer
            key={i}
            cx={center}
            cy={center}
            radius={r}
            circumference={circumference}
            progress={pcts[i]}
            color={colors[i]}
            trackColor={trackColor}
            strokeWidth={strokeWidth}
          />
        );
      })}
    </Svg>
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
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={trackColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
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
