import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  SlideInRight,
  SlideInLeft,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { G, Path } from 'react-native-svg';

import { BrandMark } from '@/components/ui/brand-mark';
import { TopoBackground } from '@/components/today/topo-background';
import {
  BoltIcon,
  FlagIcon,
  TeeIcon,
  DumbbellIcon,
  BarsIcon,
  SparkIcon,
  TrendIcon,
  CheckIcon,
} from '@/components/ui/design-icons';
import { useUser } from '@/contexts/user-context';
import { useChallenges } from '@/contexts/challenge-context';
import { requestPermissions } from '@/utils/notifications';
import {
  FontFamily,
  forest,
  greenDeep,
  citron,
  cream,
  paper,
  rule,
  muted,
  subtitleText,
  disabledBg,
  disabledFg,
  sageLight,
  G8,
  G9,
  clay,
  peach,
  flaxLight,
  slate,
  plum,
  amber,
  blueTile,
  plumTile,
  brownDark,
  brownDeep,
  orange,
  shadows,
} from '@/constants/design-tokens';

// ─── Data ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    n: '01',
    icon: 'bolt' as const,
    title: 'Set up your game plan.',
    desc: 'Pick what to track\u00A0— speed, strength, cardio. Tune it any\u00A0time.',
  },
  {
    n: '02',
    icon: 'flag' as const,
    title: 'Take on a challenge.',
    desc: 'Monthly goals push you to build the habit, not just the\u00A0workout.',
  },
  {
    n: '03',
    icon: 'bars' as const,
    title: 'Track progress.',
    desc: 'Streaks, charts, training history. The round of your\u00A0life.',
  },
  {
    n: '04',
    icon: 'check' as const,
    title: 'Stay on track.',
    desc: 'Gentle reminders, never push notifications about\u00A0steaks.',
  },
];

type PlanItem = {
  id: string;
  name: string;
  meta: string;
  tile: { bg: string; fg: string; icon: string };
};

type PlanSection = {
  id: string;
  title: string;
  items: PlanItem[];
};

const PLAN_SECTIONS: PlanSection[] = [
  {
    id: 'golf',
    title: 'Golf',
    items: [
      { id: 'speed-training', name: 'Speed Training', meta: '1 session · binary', tile: { bg: sageLight, fg: forest, icon: 'bolt' } },
      { id: 'driver', name: 'Driver', meta: '1 session · binary', tile: { bg: G9, fg: forest, icon: 'flag' } },
      { id: 'putt', name: 'Putting', meta: '2 sessions · accuracy', tile: { bg: G9, fg: forest, icon: 'tee' } },
    ],
  },
  {
    id: 'workouts',
    title: 'Workouts',
    items: [
      { id: 'gym', name: 'Strength Training', meta: '1 session · binary', tile: { bg: peach, fg: clay, icon: 'dumbbell' } },
      { id: 'cardio', name: 'Cardio', meta: '1 session · binary', tile: { bg: flaxLight, fg: amber, icon: 'trend' } },
      { id: 'core', name: 'Core', meta: '1 session · binary', tile: { bg: blueTile, fg: slate, icon: 'spark' } },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    items: [
      { id: 'meals', name: 'Meals', meta: '3× daily · log', tile: { bg: plumTile, fg: plum, icon: 'check' } },
      { id: 'sleep', name: 'Sleep', meta: 'Nightly · 7h target', tile: { bg: blueTile, fg: slate, icon: 'spark' } },
    ],
  },
];

const ALL_PLAN_IDS = PLAN_SECTIONS.flatMap((s) => s.items.map((i) => i.id));
const ENABLED_PLAN_IDS = ['speed-training', 'gym'];

type ChallengeData = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  goal: string;
  bg: string;
  bgDeep: string;
  accent: string;
  fg: string;
  icon: string;
  tag: string;
};

const ONBOARDING_CHALLENGES: ChallengeData[] = [
  {
    id: 'get-long',
    title: 'Get Long',
    subtitle: 'Build swing speed',
    meta: '12 speed-training sessions · 30\u00A0days',
    goal: '+4 MPH',
    bg: forest,
    bgDeep: greenDeep,
    accent: citron,
    fg: cream,
    icon: 'bolt',
    tag: 'POPULAR',
  },
  {
    id: 'get-strong',
    title: 'Get Strong',
    subtitle: 'Resistance + injury prevention',
    meta: '12 gym sessions · 30\u00A0days',
    goal: '+8 LB',
    bg: brownDark,
    bgDeep: brownDeep,
    accent: orange,
    fg: cream,
    icon: 'dumbbell',
    tag: 'NEW',
  },
];

// ─── Icon helper ──────────────────────────────────────────────────────

function PlanIcon({ name, color, size = 17 }: { name: string; color: string; size?: number }) {
  switch (name) {
    case 'bolt':
      return <BoltIcon size={size} color={color} />;
    case 'flag':
      return <FlagIcon size={size} color={color} />;
    case 'tee':
      return <TeeIcon size={size} color={color} />;
    case 'dumbbell':
      return <DumbbellIcon size={size} color={color} />;
    case 'trend':
      return <TrendIcon size={size} color={color} />;
    case 'spark':
      return <SparkIcon size={size} color={color} />;
    case 'bars':
      return <BarsIcon size={size} color={color} />;
    case 'check':
      return <CheckIcon size={size} color={color} />;
    default:
      return <View style={{ width: size, height: size }} />;
  }
}

// ─── Shared chrome ────────────────────────────────────────────────────

function TopBar({ page }: { page: number }) {
  return (
    <View style={[s.topBar, Platform.OS === 'web' && { paddingTop: 20 }]}>
      <Text style={s.stepCounter}>
        STEP {String(page).padStart(2, '0')} / 03
      </Text>
      <Text style={s.skipLink}>Skip ↗</Text>
    </View>
  );
}

function PageDots({ active }: { active: number }) {
  return (
    <View style={s.dotsRow}>
      {[1, 2, 3].map((idx) => {
        const isActive = idx === active;
        const isPast = idx < active;
        return (
          <View
            key={idx}
            style={[
              s.dot,
              {
                width: isActive ? 22 : 6,
                backgroundColor: isActive ? forest : isPast ? G8 : rule,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

function CTAButton({
  label,
  enabled,
  loading,
  onPress,
}: {
  label: string;
  enabled: boolean;
  loading?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!enabled || loading}
      style={[
        s.cta,
        {
          backgroundColor: enabled ? citron : disabledBg,
          ...(enabled ? shadows.cta : {}),
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator size={20} color={greenDeep} />
      ) : (
        <>
          <View style={{ width: 14 }} />
          <Text
            style={[
              s.ctaLabel,
              { color: enabled ? greenDeep : disabledFg },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              s.ctaArrow,
              { color: enabled ? greenDeep : 'transparent' },
            ]}
          >
            →
          </Text>
        </>
      )}
    </Pressable>
  );
}

function BottomBar({
  page,
  label,
  enabled,
  loading,
  onPress,
}: {
  page: number;
  label: string;
  enabled: boolean;
  loading?: boolean;
  onPress: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.bottomBar, { paddingBottom: Math.max(insets.bottom, 32) }]}>
      <LinearGradient
        colors={['rgba(247,244,234,0)', paper]}
        locations={[0, 0.36]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <PageDots active={page} />
      <CTAButton label={label} enabled={enabled} loading={loading} onPress={onPress} />
    </View>
  );
}

// ─── Radio ────────────────────────────────────────────────────────────

function Radio({ checked }: { checked: boolean }) {
  return (
    <View
      style={[
        s.radio,
        {
          backgroundColor: checked ? forest : '#fff',
          borderColor: checked ? forest : '#cfc9b5',
          ...(checked
            ? {
                shadowColor: forest,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }
            : {}),
        },
      ]}
    >
      {checked && (
        <Svg width={13} height={13} viewBox="0 0 24 24">
          <Path
            d="m5 12 5 5L20 7"
            stroke={citron}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      )}
    </View>
  );
}

// ─── Step 1: Welcome ──────────────────────────────────────────────────

function WelcomeStep() {
  return (
    <View style={s.screenFill}>
      <TopoBackground tint="#cfd9c8" opacity={0.5} viewBoxHeight={900} />

      <TopBar page={1} />

      {/* Hero */}
      <View style={s.welcomeHero}>
        <View style={s.brandRow}>
          <BrandMark size={44} />
          <View style={{ gap: 2 }}>
            <Text style={s.brandLabel}>SUBPAR · v3</Text>
            <Text style={s.brandWelcome}>WELCOME</Text>
          </View>
        </View>
        <Text style={s.displayTitleWelcome}>
          How Subpar{'\n'}works<Text style={{ color: citron }}>.</Text>
        </Text>
        <Text style={s.welcomeSubtitle}>
          Four things you do. The app does the&nbsp;rest.
        </Text>
      </View>

      {/* Step cards */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.stepCardList}
        showsVerticalScrollIndicator={false}
      >
        {STEPS.map((step) => (
          <View key={step.n} style={s.stepCard}>
            <View style={s.stepIconTile}>
              <PlanIcon name={step.icon} color={forest} size={18} />
              <View style={s.stepBadge}>
                <Text style={s.stepBadgeText}>{step.n}</Text>
              </View>
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={s.stepCardTitle}>{step.title}</Text>
              <Text style={s.stepCardDesc}>{step.desc}</Text>
            </View>
          </View>
        ))}
        <View style={{ height: 160 }} />
      </ScrollView>
    </View>
  );
}

// ─── Step 2: Build Plan ───────────────────────────────────────────────

function PlanStep({
  selectedTracks,
  onToggle,
  onToggleAll,
}: {
  selectedTracks: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}) {
  const allSelected = selectedTracks.size === ENABLED_PLAN_IDS.length;

  return (
    <View style={s.screenFill}>
      <TopBar page={2} />

      {/* Hero */}
      <View style={s.planHero}>
        <Text style={s.eyebrow}>YOUR PROGRAM</Text>
        <Text style={s.displayTitle}>
          What are we{'\n'}tracking<Text style={{ color: citron }}>?</Text>
        </Text>
        <View style={s.planFooterRow}>
          <Text style={s.planFooterLeft}>
            You can change these in&nbsp;Settings.
          </Text>
          <Pressable onPress={onToggleAll} hitSlop={8}>
            <Text style={s.selectAllLink}>
              {allSelected ? 'Clear all' : 'Select all'} ↗
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Scrollable plan sections */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.planSections}
        showsVerticalScrollIndicator={false}
      >
        {PLAN_SECTIONS.map((section) => {
          const count = section.items.filter((i) => selectedTracks.has(i.id)).length;
          return (
            <View key={section.id}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionEyebrow}>{section.title}</Text>
                <Text style={s.sectionCounter}>
                  {count}/{section.items.length}
                </Text>
              </View>
              <View style={{ gap: 8 }}>
                {section.items.map((item) => {
                  const sel = selectedTracks.has(item.id);
                  const enabled = ENABLED_PLAN_IDS.includes(item.id);
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => onToggle(item.id)}
                      disabled={!enabled}
                    >
                      <View
                        style={[
                          s.planRow,
                          {
                            backgroundColor: sel ? cream : '#fff',
                            borderColor: sel ? forest : rule,
                            opacity: enabled ? 1 : 0.45,
                            ...(sel
                              ? {
                                  shadowColor: '#1d4e34',
                                  shadowOffset: { width: 0, height: 8 },
                                  shadowOpacity: 0.1,
                                  shadowRadius: 18,
                                  elevation: 3,
                                }
                              : {}),
                          },
                        ]}
                      >
                        <View
                          style={[
                            s.planTile,
                            { backgroundColor: item.tile.bg },
                          ]}
                        >
                          <PlanIcon
                            name={item.tile.icon}
                            color={item.tile.fg}
                            size={17}
                          />
                        </View>
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text style={s.planRowName}>{item.name}</Text>
                          <Text style={s.planRowMeta}>
                            {enabled ? item.meta : 'Coming soon'}
                          </Text>
                        </View>
                        {enabled && <Radio checked={sel} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
        <View style={{ height: 160 }} />
      </ScrollView>
    </View>
  );
}

// ─── Step 3: Challenge ────────────────────────────────────────────────

function ChallengeCardTopo({ accent }: { accent: string }) {
  return (
    <Svg
      style={[StyleSheet.absoluteFill, { opacity: 0.22 }]}
      width="100%"
      height="100%"
      viewBox="0 0 350 200"
      preserveAspectRatio="xMidYMid slice"
    >
      <G fill="none" stroke={accent} strokeWidth={0.8}>
        <Path d="M-20 30 C 80 5, 200 80, 380 25" />
        <Path d="M-20 80 C 80 55, 200 130, 380 75" />
        <Path d="M-20 130 C 80 105, 200 200, 380 125" />
        <Path d="M-20 180 C 80 155, 200 250, 380 175" />
      </G>
    </Svg>
  );
}

function ChallengeSelector({
  selected,
  accent,
  bgDeep,
}: {
  selected: boolean;
  accent: string;
  bgDeep: string;
}) {
  return (
    <View
      style={[
        s.challengeSelector,
        {
          backgroundColor: selected ? accent : 'rgba(255,255,255,0.08)',
          borderColor: selected ? accent : 'rgba(251,246,230,0.35)',
          ...(selected
            ? {
                shadowColor: accent,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 5,
                elevation: 2,
              }
            : {}),
        },
      ]}
    >
      {selected && (
        <Svg width={14} height={14} viewBox="0 0 24 24">
          <Path
            d="m5 12 5 5L20 7"
            stroke={bgDeep}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      )}
    </View>
  );
}

function OnbChallengeCard({
  challenge,
  selected,
  dim,
  onPress,
}: {
  challenge: ChallengeData;
  selected: boolean;
  dim: boolean;
  onPress: () => void;
}) {
  const c = challenge;
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          s.challengeCard,
          {
            opacity: dim ? 0.62 : 1,
            ...(selected
              ? {
                  shadowColor: '#11371f',
                  shadowOffset: { width: 0, height: 16 },
                  shadowOpacity: 0.3,
                  shadowRadius: 32,
                  elevation: 8,
                }
              : {
                  shadowColor: '#11371f',
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.18,
                  shadowRadius: 22,
                  elevation: 5,
                }),
          },
        ]}
      >
        <LinearGradient
          colors={[c.bg, c.bgDeep]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
        />
        {selected && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                borderRadius: 22,
                borderWidth: 2.5,
                borderColor: c.accent,
              },
            ]}
          />
        )}
        <ChallengeCardTopo accent={c.accent} />

        {/* Top row: tag + selector */}
        <View style={s.challengeTopRow}>
          <View style={[s.challengeTag, { backgroundColor: c.accent }]}>
            <PlanIcon name={c.icon} color={c.bgDeep} size={11} />
            <Text style={[s.challengeTagText, { color: c.bgDeep }]}>
              {c.tag}
            </Text>
          </View>
          <ChallengeSelector selected={selected} accent={c.accent} bgDeep={c.bgDeep} />
        </View>

        {/* Title */}
        <View style={{ marginTop: 14 }}>
          <Text style={[s.challengeTitle, { color: c.fg }]}>
            {c.title}<Text style={{ color: c.accent }}>.</Text>
          </Text>
          <Text style={s.challengeSubtitle}>{c.subtitle}</Text>
        </View>

        {/* Metric strip */}
        <View style={s.metricStrip}>
          <View style={[s.metricPill, { flex: 1 }]}>
            <Text style={s.metricEyebrow}>GOAL</Text>
            <Text style={[s.metricValue, { color: c.accent }]}>{c.goal}</Text>
          </View>
          <View style={[s.metricPill, { flex: 1.4 }]}>
            <Text style={s.metricEyebrow}>SESSIONS</Text>
            <Text style={[s.metricMeta, { color: c.fg }]}>{c.meta}</Text>
          </View>
        </View>

        {/* Segmented preview */}
        <View style={s.segmentedRow}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={s.segment} />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

function ChallengeStep({
  selectedChallenge,
  onSelect,
}: {
  selectedChallenge: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={s.screenFill}>
      <TopBar page={3} />

      {/* Hero */}
      <View style={s.planHero}>
        <Text style={s.eyebrow}>MONTH ONE · DAY ZERO</Text>
        <Text style={s.displayTitle}>
          Take a{'\n'}challenge<Text style={{ color: citron }}>.</Text>
        </Text>
        <Text style={s.challengeHeroSubtitle}>
          Pick one to kick off your first month. Swap any&nbsp;time.
        </Text>
      </View>

      {/* Challenge cards */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.challengeList}
        showsVerticalScrollIndicator={false}
      >
        {ONBOARDING_CHALLENGES.map((c) => (
          <OnbChallengeCard
            key={c.id}
            challenge={c}
            selected={selectedChallenge === c.id}
            dim={selectedChallenge !== null && selectedChallenge !== c.id}
            onPress={() => onSelect(c.id)}
          />
        ))}

        {/* Tertiary link */}
        <View style={s.tertiaryLinkRow}>
          <Text style={s.tertiaryLink}>See all 6 challenges ↗</Text>
        </View>

        <View style={{ height: 160 }} />
      </ScrollView>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────

const ANIM_DURATION = 240;

export default function OnboardingScreen() {
  const { updateProfile } = useUser();
  const { startChallenge } = useChallenges();
  const [step, setStep] = useState(1);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  // Track step transitions with a key so Animated components remount
  const [stepKey, setStepKey] = useState(0);

  const toggleTrack = useCallback((id: string) => {
    if (!ENABLED_PLAN_IDS.includes(id)) return;
    setSelectedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedTracks((prev) => {
      if (prev.size === ENABLED_PLAN_IDS.length) return new Set();
      return new Set(ENABLED_PLAN_IDS);
    });
  }, []);

  const selectChallenge = useCallback((id: string) => {
    // Single-select: tapping same card keeps it selected (no unselect)
    setSelectedChallenge(id);
  }, []);

  const goNext = useCallback(() => {
    if (step < 3) {
      setDirection('forward');
      setStepKey((k) => k + 1);
      setStep((s) => s + 1);
    }
  }, [step]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setDirection('back');
      setStepKey((k) => k + 1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const completeOnboarding = useCallback(async () => {
    setLoading(true);
    try {
      const ids = Array.from(selectedTracks);
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
    } catch {
      setLoading(false);
    }
  }, [selectedTracks, selectedChallenge, updateProfile, startChallenge]);

  const skip = useCallback(() => {
    updateProfile({ onboardingComplete: true });
    router.replace('/(tabs)');
  }, [updateProfile]);

  // Determine CTA state
  const ctaEnabled =
    step === 1 ||
    (step === 2 && selectedTracks.size > 0) ||
    (step === 3 && selectedChallenge !== null);

  const ctaLabel =
    step === 1 ? 'Begin' : step === 2 ? 'Next' : 'Start training';

  const handleCTA = step === 3 ? completeOnboarding : goNext;

  const entering = direction === 'forward' ? SlideInRight : SlideInLeft;

  return (
    <View style={[s.container, { backgroundColor: paper }]}>
      <Pressable
        style={s.skipTouchTarget}
        onPress={skip}
        hitSlop={12}
      >
        {/* Invisible skip target that covers the Skip link area */}
      </Pressable>

      <Animated.View
        key={stepKey}
        entering={stepKey === 0 ? undefined : entering.duration(ANIM_DURATION)}
        style={StyleSheet.absoluteFill}
      >
        {step === 1 && <WelcomeStep />}
        {step === 2 && (
          <PlanStep
            selectedTracks={selectedTracks}
            onToggle={toggleTrack}
            onToggleAll={toggleAll}
          />
        )}
        {step === 3 && (
          <ChallengeStep
            selectedChallenge={selectedChallenge}
            onSelect={selectChallenge}
          />
        )}
      </Animated.View>

      {/* Bottom bar overlays content */}
      <BottomBar
        page={step}
        label={ctaLabel}
        enabled={ctaEnabled}
        loading={loading}
        onPress={handleCTA}
      />

      {/* Back gesture area — left edge */}
      {step > 1 && (
        <Pressable style={s.backEdge} onPress={goBack}>
          <View />
        </Pressable>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenFill: {
    flex: 1,
    backgroundColor: paper,
  },

  // Top bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 54,
    paddingHorizontal: 22,
  },
  stepCounter: {
    fontFamily: FontFamily.monoBold,
    fontSize: 10,
    color: muted,
    letterSpacing: 2,
  },
  skipLink: {
    fontFamily: FontFamily.monoBold,
    fontSize: 11,
    color: forest,
    letterSpacing: 0.44,
  },
  skipTouchTarget: {
    position: 'absolute',
    top: 44,
    right: 10,
    zIndex: 100,
    width: 60,
    height: 36,
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 14,
    paddingHorizontal: 22,
    gap: 14,
    alignItems: 'stretch',
    zIndex: 50,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 6,
  },

  // CTA
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  ctaLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 15,
    letterSpacing: -0.075,
  },
  ctaArrow: {
    fontFamily: FontFamily.monoBold,
    fontSize: 14,
    width: 14,
    textAlign: 'right',
  },

  // Radio
  radio: {
    width: 24,
    height: 24,
    borderRadius: 99,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Welcome step
  welcomeHero: {
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 4,
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLabel: {
    fontFamily: FontFamily.mono,
    fontSize: 9.5,
    color: muted,
    letterSpacing: 2.85,
  },
  brandWelcome: {
    fontFamily: FontFamily.monoBold,
    fontSize: 9.5,
    color: forest,
    letterSpacing: 1.71,
  },
  displayTitleWelcome: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 46,
    color: greenDeep,
    letterSpacing: -2.07,
    lineHeight: 43,
    marginTop: 4,
  },
  welcomeSubtitle: {
    fontFamily: FontFamily.outfitMedium,
    fontSize: 14,
    color: subtitleText,
    marginTop: 2,
    maxWidth: 300,
  },

  // Step cards
  stepCardList: {
    paddingHorizontal: 18,
    paddingTop: 20,
    gap: 10,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: rule,
    borderRadius: 18,
  },
  stepIconTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: sageLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: forest,
    borderRadius: 99,
    paddingVertical: 2,
    paddingHorizontal: 5,
  },
  stepBadgeText: {
    fontFamily: FontFamily.monoExtraBold,
    fontSize: 9,
    color: citron,
    letterSpacing: 0.36,
  },
  stepCardTitle: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 15.5,
    color: greenDeep,
    letterSpacing: -0.28,
    lineHeight: 18,
  },
  stepCardDesc: {
    fontFamily: FontFamily.outfitMedium,
    fontSize: 12.5,
    color: subtitleText,
    lineHeight: 17.5,
    marginTop: 4,
  },

  // Plan step
  planHero: {
    paddingHorizontal: 22,
    paddingTop: 14,
  },
  eyebrow: {
    fontFamily: FontFamily.monoExtraBold,
    fontSize: 9.5,
    color: forest,
    letterSpacing: 2.09,
    textTransform: 'uppercase',
  },
  displayTitle: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 38,
    color: greenDeep,
    letterSpacing: -1.52,
    lineHeight: 36,
    marginTop: 6,
  },
  planFooterRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  planFooterLeft: {
    fontFamily: FontFamily.outfitMedium,
    fontSize: 13.5,
    color: subtitleText,
    flex: 1,
  },
  selectAllLink: {
    fontFamily: FontFamily.monoBold,
    fontSize: 11,
    color: forest,
    letterSpacing: 0.44,
  },

  // Plan sections
  planSections: {
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  sectionEyebrow: {
    fontFamily: FontFamily.monoExtraBold,
    fontSize: 10.5,
    color: muted,
    letterSpacing: 2.31,
    textTransform: 'uppercase',
  },
  sectionCounter: {
    fontFamily: FontFamily.monoSemiBold,
    fontSize: 9.5,
    color: muted,
    opacity: 0.7,
    letterSpacing: 0.38,
  },

  // Plan row
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderRadius: 16,
  },
  planTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planRowName: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 14.5,
    color: greenDeep,
    letterSpacing: -0.22,
    lineHeight: 16,
  },
  planRowMeta: {
    fontFamily: FontFamily.monoSemiBold,
    fontSize: 10.5,
    color: muted,
    letterSpacing: 0.21,
    marginTop: 2,
  },

  // Challenge step
  challengeHeroSubtitle: {
    fontFamily: FontFamily.outfitMedium,
    fontSize: 13.5,
    color: subtitleText,
    marginTop: 8,
  },
  challengeList: {
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 14,
  },
  challengeCard: {
    borderRadius: 22,
    overflow: 'hidden',
    padding: 18,
    paddingBottom: 20,
  },
  challengeTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 1,
  },
  challengeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 99,
  },
  challengeTagText: {
    fontFamily: FontFamily.monoExtraBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  challengeSelector: {
    width: 26,
    height: 26,
    borderRadius: 99,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeTitle: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 36,
    letterSpacing: -1.08,
    lineHeight: 35,
    zIndex: 1,
  },
  challengeSubtitle: {
    fontFamily: FontFamily.outfitMedium,
    fontSize: 13,
    color: 'rgba(251,246,230,0.78)',
    marginTop: 4,
    zIndex: 1,
  },
  metricStrip: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    zIndex: 1,
  },
  metricPill: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  metricEyebrow: {
    fontFamily: FontFamily.monoBold,
    fontSize: 9.5,
    color: cream,
    opacity: 0.7,
    letterSpacing: 1.52,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 16,
    marginTop: 2,
    lineHeight: 16,
  },
  metricMeta: {
    fontFamily: FontFamily.outfitBold,
    fontSize: 13,
    marginTop: 3,
    lineHeight: 13,
  },
  segmentedRow: {
    flexDirection: 'row',
    gap: 3,
    marginTop: 14,
    zIndex: 1,
  },
  segment: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  // Tertiary link
  tertiaryLinkRow: {
    paddingTop: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
  },
  tertiaryLink: {
    fontFamily: FontFamily.monoBold,
    fontSize: 11,
    color: forest,
    letterSpacing: 0.44,
  },

  // Back edge
  backEdge: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 20,
    zIndex: 90,
  },
});
