import { useRef, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { greenDeep, sub, cream, paper, rule, citron, FontFamily } from '@/constants/design-tokens';

interface KeypadProps {
  onDigit: (d: string) => void;
  onDelete: () => void;
  onNext: () => void;
}

function SkipIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 5v14M19 12H8M14 7l5 5-5 5"
        stroke={sub}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DeleteIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 12 9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9z"
        stroke={cream}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m14 9-4 6M10 9l4 6"
        stroke={cream}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const DIGIT_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function Keypad({ onDigit, onDelete, onNext }: KeypadProps) {
  const deleteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDeletePressIn = useCallback(() => {
    deleteTimer.current = setTimeout(() => {
      // Long-press: clear entire cell (fires delete repeatedly won't work —
      // we emit a special signal by calling onDelete with current value cleared)
      onDelete();
      onDelete();
      onDelete();
    }, 500);
  }, [onDelete]);

  const handleDeletePressOut = useCallback(() => {
    if (deleteTimer.current) {
      clearTimeout(deleteTimer.current);
      deleteTimer.current = null;
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {DIGIT_KEYS.map((n, i) => {
          const isLastCol = i % 3 === 2;
          const isLastRow = i >= 6;
          return (
            <Pressable
              key={n}
              onPress={() => onDigit(n)}
              style={[
                styles.cell,
                !isLastCol && styles.borderRight,
                !isLastRow && styles.borderBottom,
              ]}
            >
              <Text style={styles.digitText}>{n}</Text>
            </Pressable>
          );
        })}
        {/* Bottom row: NEXT, 0, DELETE */}
        <Pressable onPress={onNext} style={[styles.cell, styles.borderRight]}>
          <View style={styles.nextContent}>
            <SkipIcon />
            <Text style={styles.nextText}>NEXT</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => onDigit('0')}
          style={[styles.cell, styles.borderRight]}
        >
          <Text style={styles.digitText}>0</Text>
          <View style={styles.citronAccent} />
        </Pressable>
        <Pressable
          onPress={onDelete}
          onPressIn={handleDeletePressIn}
          onPressOut={handleDeletePressOut}
          style={styles.cell}
        >
          <View style={styles.deletePill}>
            <DeleteIcon />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: paper,
    borderTopWidth: 1,
    borderTopColor: rule,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '33.333%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: rule,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: rule,
  },
  digitText: {
    fontFamily: FontFamily.monoSemiBold,
    fontSize: 24,
    color: greenDeep,
    letterSpacing: -0.01 * 24,
    fontVariant: ['tabular-nums'],
  },
  nextContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  nextText: {
    fontFamily: FontFamily.monoBold,
    fontSize: 10,
    color: sub,
    letterSpacing: 10 * 0.16,
  },
  deletePill: {
    backgroundColor: greenDeep,
    width: 56,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  citronAccent: {
    position: 'absolute',
    bottom: 10,
    width: 18,
    height: 2,
    backgroundColor: citron,
    borderRadius: 99,
  },
});
