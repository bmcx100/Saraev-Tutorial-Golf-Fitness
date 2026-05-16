import type { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ink, sub, greenDeep, FontFamily } from '@/constants/design-tokens';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  helper: string;
  progressNum: string;
  progressCaption: string;
  /** Optional element rendered inline next to the eyebrow (e.g. breadcrumb dots) */
  accessory?: ReactNode;
  compact?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  helper,
  progressNum,
  progressCaption,
  accessory,
  compact,
}: SectionHeadingProps) {
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <View style={styles.left}>
        <View style={styles.eyebrowRow}>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          {accessory}
        </View>
        <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
        {!compact && <Text style={styles.helper}>{helper}</Text>}
      </View>
      <View style={styles.right}>
        <Text style={[styles.progressNum, compact && styles.progressNumCompact]}>{progressNum}</Text>
        <Text style={styles.progressCaption}>{progressCaption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 14,
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 4,
  },
  containerCompact: {
    paddingTop: 8,
    paddingBottom: 2,
  },
  left: {
    flex: 1,
    minWidth: 0,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  eyebrow: {
    fontFamily: FontFamily.monoBold,
    fontSize: 10,
    letterSpacing: 10 * 0.24,
    color: sub,
  },
  title: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 22,
    letterSpacing: -0.03 * 22,
    color: ink,
    lineHeight: 22,
    marginTop: 3,
  },
  titleCompact: {
    fontSize: 19,
    lineHeight: 19,
    marginTop: 2,
  },
  helper: {
    fontFamily: FontFamily.outfitMedium,
    fontSize: 12,
    color: sub,
    lineHeight: 12 * 1.35,
    marginTop: 3,
  },
  right: {
    alignItems: 'flex-end',
    gap: 1,
  },
  progressNum: {
    fontFamily: FontFamily.monoBold,
    fontSize: 20,
    color: greenDeep,
    letterSpacing: -0.01 * 20,
    fontVariant: ['tabular-nums'],
  },
  progressNumCompact: {
    fontSize: 17,
  },
  progressCaption: {
    fontFamily: FontFamily.monoBold,
    fontSize: 9,
    letterSpacing: 9 * 0.22,
    color: sub,
  },
});
