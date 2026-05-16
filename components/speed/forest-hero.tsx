import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { G, Path } from 'react-native-svg';
import Animated, {
  FadeIn,
} from 'react-native-reanimated';
import {
  forest,
  greenDeep,
  G7,
  citron,
  cream,
  FontFamily,
} from '@/constants/design-tokens';

interface ForestHeroProps {
  activeTab: 0 | 1 | 2;
  onTabChange: (index: number) => void;
  sessionNumber: number;
  prValue: number | null;
  prCaption: string;
  onBack: () => void;
  compact?: boolean;
}

function BackIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5M12 19l-7-7 7-7"
        stroke={cream}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

const TAB_LABELS = ['Normal', 'Step Drill', 'Max Out'];

export function ForestHero({
  activeTab,
  onTabChange,
  sessionNumber,
  prValue,
  prCaption,
  onBack,
  compact,
}: ForestHeroProps) {
  const eyebrowText =
    activeTab === 2
      ? `DAY 1 \u00B7 SESSION ${sessionNumber} \u00B7 DRILL 3 / 3`
      : `DAY 1 \u00B7 SESSION ${sessionNumber}`;

  return (
    <View style={[styles.wrapper, compact && styles.wrapperCompact]}>
      <LinearGradient
        colors={[forest, greenDeep]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.gradient, compact && styles.gradientCompact]}
      >
        {/* Topo lines overlay */}
        <Animated.View
          entering={FadeIn.duration(400)}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 390 200"
            preserveAspectRatio="xMidYMid slice"
            style={{ opacity: 0.28 }}
          >
            <G fill="none" stroke={G7} strokeWidth={0.9}>
              <Path d="M-50 40 C 80 10, 220 110, 460 30" />
              <Path d="M-50 90 C 80 60, 220 160, 460 80" />
              <Path d="M-50 140 C 100 110, 240 200, 460 140" />
              <Path d="M-50 190 C 120 160, 260 250, 460 200" />
            </G>
          </Svg>
        </Animated.View>

        {/* Top row: back button + eyebrow */}
        <View style={styles.topRow}>
          <Pressable onPress={onBack} style={[styles.backButton, compact && styles.backButtonCompact]} hitSlop={12}>
            <BackIcon />
          </Pressable>
          <Text style={styles.eyebrowCaption} aria-hidden>
            {eyebrowText}
          </Text>
          {compact && prValue !== null && (
            <View style={styles.prInline}>
              <Text style={styles.prValueCompact}>{prValue}</Text>
              <Text style={styles.prCaptionCompact}>{prCaption}</Text>
            </View>
          )}
        </View>

        {/* Title row — hidden in compact mode (info moved to top row) */}
        {!compact && (
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Text style={styles.getLong}>Get Long</Text>
              <Text style={styles.title}>Speed Training.</Text>
            </View>
            {prValue !== null && (
              <View style={styles.titleRight}>
                <Text style={styles.prValue}>{prValue}</Text>
                <Text style={styles.prCaption}>{prCaption}</Text>
              </View>
            )}
          </View>
        )}

        {/* Tab strip */}
        <View style={[styles.tabContainer, compact && styles.tabContainerCompact]}>
          {TAB_LABELS.map((label, i) => {
            const isActive = i === activeTab;
            return (
              <Pressable
                key={label}
                onPress={() => onTabChange(i)}
                style={[
                  styles.tab,
                  compact && styles.tabCompact,
                  isActive && styles.tabActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: isActive ? greenDeep : 'rgba(251,246,230,0.7)' },
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  wrapperCompact: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  gradient: {
    paddingTop: 54,
    paddingHorizontal: 18,
    paddingBottom: 16,
    position: 'relative',
  },
  gradientCompact: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(251,246,230,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(251,246,230,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonCompact: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  eyebrowCaption: {
    fontFamily: FontFamily.monoBold,
    fontSize: 9.5,
    letterSpacing: 9.5 * 0.24,
    color: 'rgba(251,246,230,0.6)',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 14,
    zIndex: 1,
  },
  titleLeft: {
    flex: 1,
    minWidth: 0,
  },
  getLong: {
    fontFamily: FontFamily.monoExtraBold,
    fontSize: 11,
    letterSpacing: 11 * 0.22,
    textTransform: 'uppercase',
    color: citron,
  },
  title: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 28,
    letterSpacing: -0.035 * 28,
    lineHeight: 28 * 0.95,
    color: cream,
    marginTop: 4,
  },
  titleRight: {
    alignItems: 'flex-end',
  },
  prValue: {
    fontFamily: FontFamily.monoBold,
    fontSize: 22,
    color: citron,
    letterSpacing: -0.01 * 22,
  },
  prCaption: {
    fontFamily: FontFamily.monoBold,
    fontSize: 9.5,
    letterSpacing: 9.5 * 0.2,
    color: 'rgba(251,246,230,0.6)',
  },
  prInline: {
    marginLeft: 'auto',
    alignItems: 'flex-end',
  },
  prValueCompact: {
    fontFamily: FontFamily.monoBold,
    fontSize: 18,
    color: citron,
    letterSpacing: -0.01 * 18,
  },
  prCaptionCompact: {
    fontFamily: FontFamily.monoBold,
    fontSize: 8,
    letterSpacing: 8 * 0.2,
    color: 'rgba(251,246,230,0.6)',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 6,
    padding: 4,
    backgroundColor: 'rgba(251,246,230,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(251,246,230,0.16)',
    borderRadius: 14,
    marginTop: 14,
    zIndex: 1,
  },
  tabContainerCompact: {
    marginTop: 8,
    gap: 4,
    padding: 3,
    borderRadius: 12,
  },
  tab: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  tabCompact: {
    paddingVertical: 6,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: citron,
    shadowColor: citron,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  tabText: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 11.5,
    letterSpacing: 11.5 * 0.04,
    textTransform: 'uppercase',
  },
});
