import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { G, Path } from 'react-native-svg';
import Animated, { FadeIn } from 'react-native-reanimated';
import {
  forest,
  greenDeep,
  G7,
  citron,
  cream,
  FontFamily,
} from '@/constants/design-tokens';
import type { WorkoutDay } from '@/constants/strength-protocols';

interface StrengthHeroProps {
  selectedDay: WorkoutDay;
  onDayChange: (day: WorkoutDay) => void;
  muscle: string;
  exerciseCount: number;
  setsDone: number;
  setsTotal: number;
  onBack: () => void;
}

function BackIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
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

const TAB_KEYS: WorkoutDay[] = ['legs1', 'pull', 'legs2', 'push'];
const TAB_LABELS: Record<WorkoutDay, string> = {
  legs1: 'Legs 1',
  pull: 'Pull',
  legs2: 'Legs 2',
  push: 'Push',
};

export function StrengthHero({
  selectedDay,
  onDayChange,
  muscle,
  exerciseCount,
  setsDone,
  setsTotal,
  onBack,
}: StrengthHeroProps) {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[forest, greenDeep]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={styles.gradient}
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

        {/* Row 1: back + week/day label */}
        <View style={styles.topRow}>
          <Pressable onPress={onBack} style={styles.backButton} hitSlop={12}>
            <BackIcon />
          </Pressable>
          <Text style={styles.weekDayLabel}>WK 3 {'\u00B7'} DAY 2</Text>
        </View>

        {/* Row 2: title block + progress readout */}
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <Text style={styles.buildStrong}>Build Strong</Text>
            <Text style={styles.title}>Strength Training.</Text>
            <View style={styles.muscleChip}>
              <Text style={styles.muscleChipText}>
                {muscle.toUpperCase()} {'\u00B7'} {exerciseCount} EXERCISES
              </Text>
            </View>
          </View>
          <View style={styles.titleRight}>
            <Text style={styles.progressValue}>
              {setsDone} / {setsTotal}
            </Text>
            <Text style={styles.progressLabel}>SETS DONE</Text>
          </View>
        </View>

        {/* Row 3: 4-tab strip */}
        <View style={styles.tabContainer}>
          {TAB_KEYS.map((key) => {
            const isActive = key === selectedDay;
            return (
              <Pressable
                key={key}
                onPress={() => onDayChange(key)}
                style={[styles.tab, isActive && styles.tabActive]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: isActive ? greenDeep : 'rgba(251,246,230,0.7)' },
                  ]}
                >
                  {TAB_LABELS[key]}
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
  gradient: {
    paddingTop: 50,
    paddingHorizontal: 18,
    paddingBottom: 12,
    position: 'relative',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 1,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(251,246,230,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(251,246,230,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayLabel: {
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
    marginTop: 10,
    zIndex: 1,
  },
  titleLeft: {
    flex: 1,
    minWidth: 0,
  },
  buildStrong: {
    fontFamily: FontFamily.monoExtraBold,
    fontSize: 11,
    letterSpacing: 11 * 0.22,
    textTransform: 'uppercase',
    color: citron,
  },
  title: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 26,
    letterSpacing: -0.035 * 26,
    lineHeight: 26 * 0.95,
    color: cream,
    marginTop: 3,
  },
  muscleChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(207,222,80,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(207,222,80,0.4)',
    borderRadius: 99,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginTop: 6,
  },
  muscleChipText: {
    fontFamily: FontFamily.monoBold,
    fontSize: 10,
    letterSpacing: 10 * 0.18,
    color: citron,
  },
  titleRight: {
    alignItems: 'flex-end',
  },
  progressValue: {
    fontFamily: FontFamily.monoBold,
    fontSize: 22,
    letterSpacing: -0.01 * 22,
    color: citron,
    // text-shadow approximation via text shadow props
    textShadowColor: 'rgba(207,222,80,0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  progressLabel: {
    fontFamily: FontFamily.monoBold,
    fontSize: 9.5,
    letterSpacing: 9.5 * 0.2,
    color: 'rgba(251,246,230,0.6)',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 5,
    padding: 4,
    backgroundColor: 'rgba(251,246,230,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(251,246,230,0.16)',
    borderRadius: 14,
    marginTop: 12,
    zIndex: 1,
  },
  tab: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 4,
    alignItems: 'center',
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
    fontSize: 11,
    letterSpacing: 11 * 0.04,
    textTransform: 'uppercase',
  },
});
