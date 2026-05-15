import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopoBackground } from '@/components/today/topo-background';
import { BrandMark } from '@/components/ui/brand-mark';
import {
  forest,
  greenDeep,
  citron,
  cream,
  G7,
  FontFamily,
} from '@/constants/design-tokens';

interface AuthHeroProps {
  eyebrow: string;
  headline: string;
  subtitle: string;
}

/**
 * Forest hero band for the C-Split auth screens.
 * 360pt tall with topo lines, concentric ring decoration, brand mark + text.
 */
export function AuthHero({ eyebrow, headline, subtitle }: AuthHeroProps) {
  return (
    <LinearGradient
      colors={[forest, greenDeep]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={styles.hero}
    >
      {/* Topo contour lines */}
      <TopoBackground tint={G7} opacity={0.32} viewBoxHeight={360} />

      {/* Concentric ring decoration (top-right, bleeds off corner) */}
      <View style={styles.ringDecoration}>
        <Svg width={280} height={280} viewBox="0 0 280 280">
          {/* Outermost ring - citron tinted */}
          <Circle
            cx={140} cy={140} r={120}
            fill="none" stroke="rgba(207,222,80,0.32)" strokeWidth={2}
          />
          {/* Middle ring - cream */}
          <Circle
            cx={140} cy={140} r={92}
            fill="none" stroke="rgba(251,246,230,0.18)" strokeWidth={2}
          />
          {/* Inner ring - cream lighter */}
          <Circle
            cx={140} cy={140} r={64}
            fill="none" stroke="rgba(251,246,230,0.12)" strokeWidth={2}
          />
          {/* Citron arc dash (18% of circumference, starts at 12 o'clock) */}
          <Circle
            cx={140} cy={140} r={120}
            fill="none" stroke={citron} strokeWidth={3}
            strokeDasharray={`${2 * Math.PI * 120 * 0.18} ${2 * Math.PI * 120}`}
            strokeLinecap="round"
            rotation={-90}
            origin="140, 140"
          />
        </Svg>
      </View>

      <SafeAreaView edges={['top']} style={styles.heroContent}>
        {/* Brand row */}
        <View style={styles.brandRow}>
          <BrandMark size={42} onDark />
          <Text style={styles.brandCaption}>SUBPAR {'\u00B7'} v3</Text>
        </View>

        {/* Eyebrow */}
        <Text style={styles.eyebrow}>{eyebrow}</Text>

        {/* Headline */}
        <Text style={styles.headline}>{headline}</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{subtitle}</Text>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 360,
    overflow: 'hidden',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  ringDecoration: {
    position: 'absolute',
    right: -80,
    top: -40,
    opacity: 0.85,
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    justifyContent: 'flex-end',
    paddingBottom: 70,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandCaption: {
    fontFamily: FontFamily.monoBold,
    fontSize: 10,
    letterSpacing: 10 * 0.3,
    color: 'rgba(251,246,230,0.55)',
  },
  eyebrow: {
    marginTop: 20,
    fontFamily: FontFamily.monoExtraBold,
    fontSize: 11,
    letterSpacing: 11 * 0.22,
    textTransform: 'uppercase',
    color: citron,
  },
  headline: {
    marginTop: 8,
    fontFamily: FontFamily.outfitExtraBold,
    fontSize: 48,
    letterSpacing: 48 * -0.045,
    lineHeight: 48 * 0.92,
    color: cream,
  },
  subtitle: {
    marginTop: 6,
    fontFamily: FontFamily.outfitMedium,
    fontSize: 14,
    color: 'rgba(251,246,230,0.72)',
  },
});
