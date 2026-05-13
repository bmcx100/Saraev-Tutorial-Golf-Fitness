import { Tabs, Redirect } from 'expo-router';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useUser } from '@/contexts/user-context';

export default function TabLayout() {
  const colors = useColors();
  const { isOnboardingComplete, isLoading } = useUser();

  if (isLoading) return null;

  if (!isOnboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Today',
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="checkmark.circle.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="challenges"
            options={{
              title: 'Challenges',
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="flag.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="stats"
            options={{
              title: 'Stats',
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="chart.bar.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen name="explore" options={{ href: null }} />
      </Tabs>
  );
}
