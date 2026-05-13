import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface SpeedInputFieldProps {
  value: number | null;
  active: boolean;
  onPress: () => void;
  label: string;
  error?: boolean;
}

export function SpeedInputField({ value, active, onPress, label, error }: SpeedInputFieldProps) {
  const colors = useColors();

  const borderColor = active
    ? colors.accent
    : error
      ? '#EF4444'
      : colors.border;

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.field,
          {
            backgroundColor: colors.surface,
            borderColor,
            borderWidth: active ? 2 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.value,
            { color: value !== null ? colors.text : colors.textSecondary },
          ]}
        >
          {value !== null ? String(value) : '--'}
        </Text>
        <Text style={[styles.unit, { color: colors.textSecondary }]}>mph</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 72,
    gap: 3,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 12,
    fontWeight: '500',
  },
});
