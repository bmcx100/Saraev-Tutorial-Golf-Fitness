import { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';
import {
  ink,
  forest,
  greenDeep,
  citron,
  paper,
  rule,
  FontFamily,
  subtitleText,
} from '@/constants/design-tokens';

export type AdjustScope = 'this' | 'remaining' | 'all';
export type AdjustField = 'weight' | 'reps';

interface AdjustSheetProps {
  visible: boolean;
  field: AdjustField;
  value: number;
  onApply: (value: number, scope: AdjustScope) => void;
  onCancel: () => void;
}

const SCOPE_OPTIONS: { key: AdjustScope; label: string }[] = [
  { key: 'this', label: 'This set' },
  { key: 'remaining', label: 'Remaining' },
  { key: 'all', label: 'All sets' },
];

export function AdjustSheet({ visible, field, value, onApply, onCancel }: AdjustSheetProps) {
  const [draft, setDraft] = useState(value);
  const [scope, setScope] = useState<AdjustScope>('this');

  // Reset draft when sheet opens with new value
  const handleShow = () => {
    setDraft(value);
    setScope('this');
  };

  const step = field === 'weight' ? 5 : 1;
  const unit = field === 'weight' ? 'lb' : 'reps';
  const label = field === 'weight' ? 'Weight' : 'Reps';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onShow={handleShow}
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <Animated.View
          entering={SlideInDown.duration(280).springify().damping(18)}
          style={styles.sheet}
        >
          <Pressable>
            {/* Handle bar */}
            <View style={styles.handleRow}>
              <View style={styles.handle} />
            </View>

            {/* Title */}
            <Text style={styles.title}>Adjust {label}</Text>

            {/* Stepper */}
            <View style={styles.stepperRow}>
              <Pressable
                onPress={() => setDraft((d) => Math.max(0, d - step))}
                style={styles.stepperBtn}
              >
                <Text style={styles.stepperBtnText}>{'\u2212'}</Text>
              </Pressable>

              <View style={styles.stepperValue}>
                <Text style={styles.stepperValueText}>{draft}</Text>
                <Text style={styles.stepperUnit}>{unit}</Text>
              </View>

              <Pressable
                onPress={() => setDraft((d) => d + step)}
                style={styles.stepperBtn}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </Pressable>
            </View>

            {/* Scope toggle */}
            <Text style={styles.scopeLabel}>APPLY TO</Text>
            <View style={styles.scopeRow}>
              {SCOPE_OPTIONS.map((opt) => {
                const isActive = opt.key === scope;
                return (
                  <Pressable
                    key={opt.key}
                    onPress={() => setScope(opt.key)}
                    style={[styles.scopeChip, isActive && styles.scopeChipActive]}
                  >
                    <Text style={[styles.scopeChipText, isActive && styles.scopeChipTextActive]}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Actions */}
            <View style={styles.actionsRow}>
              <Pressable onPress={onCancel} style={styles.cancelBtn}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={() => onApply(draft, scope)} style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>Apply</Text>
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
  handleRow: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: rule,
  },
  title: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 18,
    color: ink,
    letterSpacing: -0.02 * 18,
    marginBottom: 16,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: paper,
    borderWidth: 1,
    borderColor: rule,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 22,
    color: forest,
  },
  stepperValue: {
    alignItems: 'center',
    minWidth: 80,
  },
  stepperValueText: {
    fontFamily: FontFamily.monoExtraBold,
    fontSize: 32,
    color: greenDeep,
    fontVariant: ['tabular-nums'],
  },
  stepperUnit: {
    fontFamily: FontFamily.monoSemiBold,
    fontSize: 11,
    color: subtitleText,
    letterSpacing: 0.04 * 11,
    marginTop: 2,
  },
  scopeLabel: {
    fontFamily: FontFamily.monoBold,
    fontSize: 10,
    letterSpacing: 10 * 0.18,
    color: subtitleText,
    marginBottom: 8,
  },
  scopeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  scopeChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: rule,
    alignItems: 'center',
  },
  scopeChipActive: {
    backgroundColor: citron,
    borderColor: citron,
  },
  scopeChipText: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 13,
    color: subtitleText,
  },
  scopeChipTextActive: {
    color: greenDeep,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: rule,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 15,
    color: ink,
  },
  applyBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: citron,
    alignItems: 'center',
    shadowColor: citron,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  applyBtnText: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 15,
    color: greenDeep,
  },
});
