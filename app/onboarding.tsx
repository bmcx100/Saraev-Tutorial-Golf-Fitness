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

const ONBOARDING_CHALLENGES = [
  {
    id: 'get-long',
    name: 'Get Long',
    icon: 'bolt' as const,
    color: '#2D6A4F',
    description: 'Build swing speed: 12 speed stick sessions this\u00A0month',
    requiredHabits: ['speed-sticks'],
  },
  {
    id: 'get-strong',
    name: 'Get Strong',
    icon: 'fitness-center' as const,
    color: '#E63946',
    description: 'Build strength: 12 gym sessions this\u00A0month',
    requiredHabits: ['gym'],
  },
  {
    id: 'tighten-it-up',
    name: 'Tighten It Up',
    icon: 'directions-run' as const,
    color: '#F59E0B',
    description: 'Stay sharp: 12 cardio or core sessions this\u00A0month',
    requiredHabits: ['cardio', 'core'],
  },
];

const OVERVIEW_CARDS = [
  {
    icon: 'bolt' as const,
    title: 'Set Up Your Game Plan',
    description: 'Choose what to track: speed, strength, cardio, and\u00A0more',
  },
  {
    icon: 'local-fire-department' as const,
    title: 'Take Challenges',
    description: 'Push yourself with monthly goals to build\u00A0consistency',
  },
  {
    icon: 'bar-chart' as const,
    title: 'Track Progress',
    description: 'See your streaks, charts, and training\u00A0history',
  },
  {
    icon: 'notifications-active' as const,
    title: 'Stay on Track',
    description: 'Get reminders that keep your routine dialed\u00A0in',
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const { updateProfile } = useUser();
  const { startChallenge } = useChallenges();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === HABIT_LIBRARY.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(HABIT_LIBRARY.map((h) => h.id)));
    }
  };

  const availableChallenges = ONBOARDING_CHALLENGES.filter((c) =>
    c.requiredHabits.some((hid) => selected.has(hid)),
  );

  const handleAdvanceFromStep1 = () => {
    if (availableChallenges.length === 0) {
      handleFinish();
    } else {
      setSelectedChallenge(null);
      setStep(2);
    }
  };

  const handleFinish = async () => {
    const ids = Array.from(selected);

    await requestPermissions();

    updateProfile({
      onboardingComplete: true,
      activeHabitIds: ids,
      notificationsEnabled: true,
    });

    if (selectedChallenge) {
      await startChallenge(selectedChallenge);
    }

    router.replace('/(tabs)');
  };

  const categories = ['golf', 'workout', 'lifestyle'] as const;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                How SUBPAR Works
              </Text>
            </View>
            {OVERVIEW_CARDS.map((card) => (
              <View
                key={card.icon}
                style={[styles.overviewCard, { backgroundColor: colors.surface }]}
              >
                <View style={[styles.overviewIcon, { backgroundColor: colors.tint + '20' }]}>
                  <MaterialIcons name={card.icon} size={24} color={colors.tint} />
                </View>
                <View style={styles.overviewInfo}>
                  <Text style={[styles.overviewTitle, { color: colors.text }]}>
                    {card.title}
                  </Text>
                  <Text style={[styles.overviewDesc, { color: colors.textSecondary }]}>
                    {card.description}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}

        {step === 1 && (
          <>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                Build Your Game Plan
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                You can change these anytime in{'\u00A0'}Settings.
              </Text>
              <Pressable onPress={toggleAll} style={styles.toggleAll}>
                <Text style={[styles.toggleAllText, { color: colors.accent }]}>
                  {selected.size === HABIT_LIBRARY.length ? 'Deselect All' : 'Select All'}
                </Text>
              </Pressable>
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
          </>
        )}

        {step === 2 && (
          <>
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                Take a Challenge
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Pick one to kick off your first{'\u00A0'}month.
              </Text>
            </View>

            {availableChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                selected={selectedChallenge === challenge.id}
                onSelect={() =>
                  setSelectedChallenge((prev) =>
                    prev === challenge.id ? null : challenge.id,
                  )
                }
                colors={colors}
              />
            ))}
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <StepIndicator current={step} total={3} colors={colors} />
        {step === 0 && (
          <Pressable
            onPress={() => setStep(1)}
            style={[styles.actionButton, { backgroundColor: colors.tint }]}
          >
            <Text style={styles.actionText}>Continue</Text>
          </Pressable>
        )}
        {step === 1 && (
          <Pressable
            onPress={handleAdvanceFromStep1}
            style={[
              styles.actionButton,
              { backgroundColor: selected.size > 0 ? colors.tint : colors.border },
            ]}
            disabled={selected.size === 0}
          >
            <Text style={styles.actionText}>Next</Text>
          </Pressable>
        )}
        {step === 2 && (
          <Pressable
            onPress={handleFinish}
            style={[
              styles.actionButton,
              { backgroundColor: selectedChallenge ? colors.tint : colors.border },
            ]}
            disabled={!selectedChallenge}
          >
            <Text style={styles.actionText}>Start Training</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function StepIndicator({
  current,
  total,
  colors,
}: {
  current: number;
  total: number;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i === current ? colors.tint : colors.border,
            },
          ]}
        />
      ))}
    </View>
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
          {habit.duration} · {habit.trackingType}
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

function ChallengeCard({
  challenge,
  selected,
  onSelect,
  colors,
}: {
  challenge: (typeof ONBOARDING_CHALLENGES)[number];
  selected: boolean;
  onSelect: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.challengeCard,
        {
          backgroundColor: selected ? colors.accentLight : colors.surface,
          borderColor: selected ? colors.accent : colors.border,
        },
      ]}
    >
      <View style={[styles.challengeIcon, { backgroundColor: challenge.color + '20' }]}>
        <MaterialIcons name={challenge.icon as any} size={28} color={challenge.color} />
      </View>
      <View style={styles.challengeInfo}>
        <Text style={[styles.challengeName, { color: colors.text }]}>
          {challenge.name}
        </Text>
        <Text style={[styles.challengeDesc, { color: colors.textSecondary }]}>
          {challenge.description}
        </Text>
      </View>
      <MaterialIcons
        name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
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
    paddingBottom: 140,
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
  toggleAll: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  toggleAllText: {
    fontSize: 15,
    fontWeight: '600',
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
  // Overview cards
  overviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    gap: 14,
  },
  overviewIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewInfo: {
    flex: 1,
    gap: 2,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  overviewDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Habit cards
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
  // Challenge cards
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    gap: 14,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeInfo: {
    flex: 1,
    gap: 4,
  },
  challengeName: {
    fontSize: 17,
    fontWeight: '700',
  },
  challengeDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 36,
    borderTopWidth: 1,
    alignItems: 'center',
    gap: 12,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  actionButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
