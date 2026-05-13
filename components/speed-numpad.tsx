import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';

interface SpeedNumpadProps {
  onDigit: (d: string) => void;
  onDelete: () => void;
  onTab: () => void;
  visible: boolean;
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['tab', '0', 'del'],
];

export function SpeedNumpad({ onDigit, onDelete, onTab, visible }: SpeedNumpadProps) {
  const colors = useColors();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(visible ? 0 : 220, { duration: 200 }) }],
    opacity: withTiming(visible ? 1 : 0, { duration: 150 }),
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderTopColor: colors.border },
        animatedStyle,
      ]}
      pointerEvents={visible ? 'auto' : 'none'}
    >
      {KEYS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((key) => {
            if (key === 'tab') {
              return (
                <Pressable
                  key={key}
                  onPress={onTab}
                  style={({ pressed }) => [
                    styles.key,
                    { backgroundColor: pressed ? colors.border : 'transparent' },
                  ]}
                >
                  <MaterialIcons name="keyboard-tab" size={22} color={colors.textSecondary} />
                </Pressable>
              );
            }
            if (key === 'del') {
              return (
                <Pressable
                  key={key}
                  onPress={onDelete}
                  style={({ pressed }) => [
                    styles.key,
                    { backgroundColor: pressed ? colors.border : 'transparent' },
                  ]}
                >
                  <MaterialIcons name="backspace" size={22} color={colors.textSecondary} />
                </Pressable>
              );
            }
            return (
              <Pressable
                key={key}
                onPress={() => onDigit(key)}
                style={({ pressed }) => [
                  styles.key,
                  { backgroundColor: pressed ? colors.border : 'transparent' },
                ]}
              >
                <Text style={[styles.keyText, { color: colors.text }]}>{key}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  key: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 2,
    marginVertical: 1,
  },
  keyText: {
    fontSize: 22,
    fontWeight: '500',
  },
});
