import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface WeekdayPickerProps {
  selectedDays: number[];
  onChange: (days: number[]) => void;
}

export function WeekdayPicker({ selectedDays, onChange }: WeekdayPickerProps) {
  const colors = useColors();

  const toggle = (day: number) => {
    const next = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day].sort((a, b) => a - b);
    onChange(next);
  };

  return (
    <View style={styles.row}>
      {DAY_LABELS.map((label, i) => {
        const selected = selectedDays.includes(i);
        return (
          <Pressable
            key={i}
            onPress={() => toggle(i)}
            style={[
              styles.pill,
              selected
                ? { backgroundColor: colors.accent }
                : { borderColor: colors.border, borderWidth: 1 },
            ]}
          >
            <Text
              style={[
                styles.pillText,
                { color: selected ? '#fff' : colors.textSecondary },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
