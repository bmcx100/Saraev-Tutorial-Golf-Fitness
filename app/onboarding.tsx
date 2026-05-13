import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { HABIT_LIBRARY, type Habit } from '@/constants/habits';
import { useUser } from '@/contexts/user-context';
import { useChallenges } from '@/contexts/challenge-context';
import { useColors } from '@/hooks/use-colors';
import { requestPermissions } from '@/utils/notifications';

export default function OnboardingScreen() {
  const colors = useColors();
  const { updateProfile } = useUser();
  const { startChallenge } = useChallenges();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categories = ['golf', 'workout', 'lifestyle'] as const;

  const handleStart = async () => {
    if (selected.size === 0) return;

    await requestPermissions();

    const ids = Array.from(selected);
    updateProfile({
      onboardingComplete: true,
      activeHabitIds: ids,
      notificationsEnabled: true,
    });

    // Auto-start 3-day onboarding challenge
    startChallenge('onboarding-3day');

    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>What's Worth Tracking{'\u00A0'}to{'\u00A0'}You?</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            You can change these anytime in&nbsp;Settings.
          </Text>
        </View>

        {categories.map((cat) => {
          const habits = HABIT_LIBRARY.filter((h) => h.category === cat);
          return (
            <View key={cat} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                {cat === 'workout' ? 'Workouts' : cat === 'lifestyle' ? 'Lifestyle' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  selected={selected.has(habit.id)}
                  onToggle={() => toggle(habit.id)}
                  colors={colors}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <Pressable
          onPress={handleStart}
          style={[
            styles.startButton,
            {
              backgroundColor: selected.size > 0 ? colors.tint : colors.border,
            },
          ]}
          disabled={selected.size === 0}
        >
          <Text style={styles.startText}>Start Tracking</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function HabitCard({
  habit,
  selected,
  onToggle,
  colors,
}: {
  habit: Habit;
  selected: boolean;
  onToggle: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={[
        styles.card,
        {
          backgroundColor: selected ? colors.accentLight : colors.surface,
          borderColor: selected ? colors.accent : colors.border,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: habit.ringColor + '20' }]}>
        <MaterialIcons name={habit.icon as any} size={24} color={habit.ringColor} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={[styles.cardName, { color: colors.text }]}>{habit.name}</Text>
        <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
          {habit.trackingType === 'counter' ? habit.duration : habit.duration} · {habit.trackingType}
        </Text>
      </View>
      <MaterialIcons
        name={selected ? 'check-circle' : 'radio-button-unchecked'}
        size={24}
        color={selected ? colors.accent : colors.border}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
    gap: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardMeta: {
    fontSize: 13,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  startButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  startText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
