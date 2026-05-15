import { View, StyleSheet } from 'react-native';
import { paper, rule } from '@/constants/design-tokens';

interface SwingDotsProps {
  color: string;
  muted: boolean;
}

// Static decorative dots — all 3 always show empty state.
// Props wired for future fill tracking.
export function SwingDots(_props: SwingDotsProps) {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
        <View
          key={i}
          style={[styles.dot, { backgroundColor: 'rgba(14,33,24,0.18)' }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: '-50%' }, { translateY: '50%' }],
    backgroundColor: paper,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 99,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: rule,
  } as any,
  dot: {
    width: 6,
    height: 6,
    borderRadius: 99,
  },
});
