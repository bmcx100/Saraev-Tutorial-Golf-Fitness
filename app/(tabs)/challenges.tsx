import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useChallenges } from '@/contexts/challenge-context';
import { useColors } from '@/hooks/use-colors';
import { ChallengeCard } from '@/components/challenge-card';
import { AvailableChallengeRow, CompletedChallengeRow } from '@/components/challenge-row';

export default function ChallengesScreen() {
  const colors = useColors();
  const {
    activeChallenge,
    challengeProgress,
    availableChallenges,
    completedChallenges,
    startChallenge,
  } = useChallenges();
  const [showCompleted, setShowCompleted] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>Challenges</Text>

        {/* Active challenge hero */}
        {activeChallenge && (
          <View style={styles.section}>
            <ChallengeCard
              challenge={activeChallenge}
              progress={challengeProgress}
            />
          </View>
        )}

        {/* Available challenges */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Available Challenges
          </Text>
          {availableChallenges.length === 0 && (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No challenges available for your current sessions.
            </Text>
          )}
          {availableChallenges.map((template) => (
            <AvailableChallengeRow
              key={template.id}
              template={template}
              disabled={!!activeChallenge}
              onStart={() => startChallenge(template.id)}
            />
          ))}
          {activeChallenge && availableChallenges.length > 0 && (
            <Text style={[styles.disabledNote, { color: colors.textSecondary }]}>
              Complete your active challenge before starting a new&nbsp;one.
            </Text>
          )}
        </View>

        {/* Completed challenges */}
        {completedChallenges.length > 0 && (
          <View style={styles.section}>
            <Pressable
              onPress={() => setShowCompleted(!showCompleted)}
              style={styles.completedHeader}
            >
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                Completed ({completedChallenges.length})
              </Text>
              <MaterialIcons
                name={showCompleted ? 'expand-less' : 'expand-more'}
                size={22}
                color={colors.textSecondary}
              />
            </Pressable>
            {showCompleted &&
              completedChallenges.map((c) => (
                <CompletedChallengeRow key={c.id} challenge={c} />
              ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 20,
  },
  disabledNote: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
