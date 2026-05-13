import { useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface PaceToastProps {
  message: string;
  variant: 'celebration' | 'warning';
  visible: boolean;
  onDismiss: () => void;
  delay?: number;
}

export function PaceToast({ message, variant, visible, onDismiss, delay = 0 }: PaceToastProps) {
  const translateY = useSharedValue(-100);

  useEffect(() => {
    if (visible) {
      translateY.value = withDelay(delay, withTiming(0, { duration: 300 }));
      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000 + delay);
      return () => clearTimeout(timer);
    } else {
      translateY.value = withTiming(-100, { duration: 200 });
    }
  }, [visible, delay, onDismiss, translateY]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  const bgColor = variant === 'celebration' ? 'rgba(82, 183, 136, 0.15)' : 'rgba(230, 57, 70, 0.15)';
  const iconColor = variant === 'celebration' ? '#52B788' : '#E63946';
  const iconName = variant === 'celebration' ? 'star' : 'warning';

  return (
    <Animated.View style={[styles.container, animStyle]}>
      <Pressable onPress={onDismiss} style={[styles.card, { backgroundColor: bgColor }]}>
        <MaterialIcons name={iconName as any} size={20} color={iconColor} />
        <Text style={[styles.message, { color: iconColor }]}>{message}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});
