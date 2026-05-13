import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserProvider } from '@/contexts/user-context';
import { migrateIfNeeded } from '@/utils/migration';

const GolfLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2D6A4F',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#11181C',
  },
};

const GolfDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#52B788',
    background: '#0D1B0D',
    card: '#1A2E1A',
    text: '#ECEDEE',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    migrateIfNeeded();
  }, []);

  return (
    <UserProvider>
      <ThemeProvider value={colorScheme === 'dark' ? GolfDarkTheme : GolfLightTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false, presentation: 'card' }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </UserProvider>
  );
}
