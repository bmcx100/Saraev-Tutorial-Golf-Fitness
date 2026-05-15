import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
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

/**
 * Custom floating dark tab bar per the v3b design system.
 * Forest background, citron active pill, icon-only inactive tabs.
 */
export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 24) }]}>
      <View style={styles.bar}>
        {TABS.map((tab, i) => {
          // The tab layout may have hidden routes (e.g. explore with href: null)
          // so we need to match by route name
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
  const animatedStyle = useAnimatedStyle(() => ({
    flex: withTiming(isActive ? 1.4 : 1, {
      duration: 220,
      easing: Easing.out(Easing.ease),
    }),
    backgroundColor: withTiming(
      isActive ? citron : 'transparent',
      { duration: 220, easing: Easing.out(Easing.ease) },
    ),
  }));

  return (
    <AnimatedPressable
      style={[styles.tab, animatedStyle]}
      onPress={onPress}
    >
      <Icon
        size={18}
        color={isActive ? forest : 'rgba(251,246,230,0.65)'}
      />
      {isActive && (
        <Text style={styles.tabLabel}>{label}</Text>
      )}
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
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 24,
    minHeight: 44,
  },
  tabLabel: {
    fontSize: 13,
    fontFamily: FontFamily.outfitExtraBold,
    color: forest,
  },
});
