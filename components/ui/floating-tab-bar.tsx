import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { forest, citron, FontFamily, shadows } from '@/constants/design-tokens';
import { CheckCircleIcon, FlagIcon, BarsIcon } from '@/components/ui/design-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const TABS = [
  { key: 'index', label: 'Today', Icon: CheckCircleIcon },
  { key: 'challenges', label: 'Challenges', Icon: FlagIcon },
  { key: 'stats', label: 'Stats', Icon: BarsIcon },
] as const;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TIMING = { duration: 220, easing: Easing.out(Easing.ease) };

/**
 * Custom floating dark tab bar per the v3b design system.
 * Forest background, citron active pill, labels always visible.
 */
export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 24) }]}>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const routeIndex = state.routes.findIndex((r) => r.name === tab.key);
          const isActive = state.index === routeIndex;
          const { Icon } = tab;

          return (
            <TabItem
              key={tab.key}
              label={tab.label}
              Icon={Icon}
              isActive={isActive}
              onPress={() => {
                if (process.env.EXPO_OS === 'ios') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                if (!isActive && routeIndex >= 0) {
                  navigation.navigate(state.routes[routeIndex].name);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

interface TabItemProps {
  label: string;
  Icon: typeof CheckCircleIcon;
  isActive: boolean;
  onPress: () => void;
}

function TabItem({ label, Icon, isActive, onPress }: TabItemProps) {
  const active = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    active.value = withTiming(isActive ? 1 : 0, TIMING);
  }, [isActive]);

  const pillStyle = useAnimatedStyle(() => ({
    flex: 1 + active.value * 0.4,
    backgroundColor:
      active.value > 0.5 ? citron : 'transparent',
  }));

  return (
    <AnimatedPressable
      style={[styles.tab, pillStyle]}
      onPress={onPress}
    >
      <Icon
        size={18}
        color={isActive ? forest : 'rgba(251,246,230,0.85)'}
      />
      <Text
        style={[
          styles.tabLabel,
          isActive ? styles.tabLabelActive : styles.tabLabelInactive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  bar: {
    backgroundColor: forest,
    borderRadius: 30,
    padding: 6,
    flexDirection: 'row',
    gap: 4,
    ...shadows.tabBar,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 24,
    minHeight: 44,
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: FontFamily.outfitBold,
  },
  tabLabelActive: {
    color: forest,
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 13,
  },
  tabLabelInactive: {
    color: 'rgba(251,246,230,0.65)',
  },
});
