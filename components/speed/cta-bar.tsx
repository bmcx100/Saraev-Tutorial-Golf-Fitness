import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { citron, greenDeep, rule, FontFamily } from '@/constants/design-tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CTABarProps {
  label: string;
  glyph: string;
  onPress: () => void;
  loading?: boolean;
}

export function CTABar({ label, glyph, onPress, loading }: CTABarProps) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => { scale.value = withTiming(0.96, { duration: 100 }); }}
        onPressOut={() => { scale.value = withTiming(1, { duration: 150 }); }}
        style={[styles.button, animStyle]}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {loading ? (
          <ActivityIndicator color={greenDeep} />
        ) : (
          <>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.glyph}>{glyph}</Text>
          </>
        )}
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 22,
    borderTopWidth: 1,
    borderTopColor: rule,
    backgroundColor: '#ffffff',
  },
  button: {
    width: '100%',
    backgroundColor: citron,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: citron,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    shadowRadius: 22,
    elevation: 6,
  },
  label: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 15.5,
    letterSpacing: -0.005 * 15.5,
    color: greenDeep,
  },
  glyph: {
    fontFamily: FontFamily.monoBold,
    fontSize: 16,
    color: greenDeep,
  },
});
