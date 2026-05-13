import { View, Text, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { useColors } from '@/hooks/use-colors';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const colors = useColors();
  const widthAnim = useRef(new Animated.Value(0)).current;
  const fraction = total > 0 ? completed / total : 0;
  const allDone = completed === total && total > 0;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: fraction,
      useNativeDriver: false,
      tension: 40,
      friction: 8,
    }).start();
  }, [fraction]);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.text }]}>
          {completed}/{total} complete
        </Text>
        {allDone && <Text style={styles.badge}>All done!</Text>}
      </View>
      <View style={[styles.track, { backgroundColor: colors.progressTrack }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: colors.progressFill,
              width: widthAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  badge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D6A4F',
  },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
