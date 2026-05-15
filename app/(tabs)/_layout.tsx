import { Tabs, Redirect } from 'expo-router';

import { FloatingTabBar } from '@/components/ui/floating-tab-bar';
import { useUser } from '@/contexts/user-context';

export default function TabLayout() {
  const { isOnboardingComplete, isLoading } = useUser();

  if (isLoading) return null;

  if (!isOnboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today' }} />
      <Tabs.Screen name="challenges" options={{ title: 'Challenges' }} />
      <Tabs.Screen name="stats" options={{ title: 'Stats' }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
