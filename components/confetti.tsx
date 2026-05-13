import { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const CONFETTI_COLORS = [
  '#2D6A4F',
  '#52B788',
  '#E63946',
  '#F4845F',
  '#457B9D',
  '#F59E0B',
  '#7B2CBF',
  '#48CAE4',
];

interface ConfettiProps {
  active: boolean;
  particleCount?: number;
  duration?: number;
  message?: string;
  onComplete?: () => void;
}

export function Confetti({
  active,
  particleCount = 40,
  duration = 2000,
  message,
  onComplete,
}: ConfettiProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (active) {
      opacity.value = withTiming(1, { duration: 200 });
      opacity.value = withDelay(
        duration - 400,
        withTiming(0, { duration: 400 }, (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        }),
      );
    } else {
      opacity.value = 0;
    }
  }, [active, duration, onComplete, opacity]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: active ? 'none' as const : 'none' as const,
  }));

  if (!active) return null;

  return (
    <Animated.View style={[styles.overlay, containerStyle]}>
      {Array.from({ length: particleCount }).map((_, i) => (
        <Particle
          key={i}
          index={i}
          duration={duration}
          color={CONFETTI_COLORS[i % CONFETTI_COLORS.length]}
        />
      ))}
      {message && (
        <MessageOverlay message={message} duration={duration} />
      )}
    </Animated.View>
  );
}

function Particle({
  index,
  duration,
  color,
}: {
  index: number;
  duration: number;
  color: string;
}) {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(Math.random() * SCREEN_W);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const delay = Math.random() * 300;
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_H + 20, {
        duration: duration - delay,
        easing: Easing.out(Easing.quad),
      }),
    );
    translateX.value = withDelay(
      delay,
      withTiming(translateX.value + (Math.random() - 0.5) * 100, {
        duration: duration - delay,
      }),
    );
    rotate.value = withDelay(
      delay,
      withTiming(360 * (Math.random() > 0.5 ? 1 : -1), {
        duration: duration - delay,
      }),
    );
    scale.value = withDelay(
      delay,
      withTiming(0.3, { duration: duration - delay }),
    );
  }, [duration, rotate, scale, translateX, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  const size = 6 + Math.random() * 6;

  return (
    <Animated.View
      style={[
        styles.particle,
        style,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
}

function MessageOverlay({ message, duration }: { message: string; duration: number }) {
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.back(1.5)) });
    opacity.value = withTiming(1, { duration: 300 });
    opacity.value = withDelay(duration - 600, withTiming(0, { duration: 300 }));
  }, [duration, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.messageContainer, style]}>
      <Animated.Text style={styles.messageText}>{message}</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  particle: {
    position: 'absolute',
  },
  messageContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
});
