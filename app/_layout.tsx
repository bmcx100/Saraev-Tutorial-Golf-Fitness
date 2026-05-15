import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';
import {
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
  JetBrainsMono_800ExtraBold,
} from '@expo-google-fonts/jetbrains-mono';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { UserProvider } from '@/contexts/user-context';
import { HabitProvider } from '@/contexts/habit-context';
import { ChallengeProvider } from '@/contexts/challenge-context';
import { migrateIfNeeded } from '@/utils/migration';
import type { Session } from '@supabase/supabase-js';

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

function useProtectedRoute(session: Session | null, isLoading: boolean, isPasswordRecovery: boolean) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inLogin = segments[0] === 'login';
    const inResetPassword = segments[0] === 'reset-password';

    if (session && isPasswordRecovery && !inResetPassword) {
      router.replace('/reset-password');
    } else if (!session && !inLogin) {
      router.replace('/login');
    } else if (session && !isPasswordRecovery && (inLogin || inResetPassword)) {
      router.replace('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- router is stable
  }, [session, segments, isLoading, isPasswordRecovery]);
}

function InnerNavigator() {
  const colorScheme = useColorScheme();
  const { session, isLoading, isPasswordRecovery } = useAuth();
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
    JetBrainsMono_800ExtraBold,
  });

  useProtectedRoute(session, isLoading, isPasswordRecovery);

  useEffect(() => {
    migrateIfNeeded();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? GolfDarkTheme : GolfLightTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="speed" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="strength" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="stats-speed" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="stats-strength" options={{ headerShown: false, presentation: 'card' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <UserProvider>
        <HabitProvider>
          <ChallengeProvider>
            <InnerNavigator />
          </ChallengeProvider>
        </HabitProvider>
      </UserProvider>
    </AuthProvider>
  );
}
