import { Platform } from 'react-native';

// ── Colors ───────────────────────────────────────────────────────────
// Green scale G1–G10 (dark → light)
export const G1 = '#0a2515';
export const G2 = '#11371f';
export const G3 = '#1d4e34';
export const G4 = '#2a6243';
export const G5 = '#387b54';
export const G6 = '#4f9869';
export const G7 = '#6db483';
export const G8 = '#92cba2';
export const G9 = '#bcdfc6';
export const G10 = '#e1eee4';

// Citron accent
export const Y5 = '#cfde50';

// Neutrals
export const ink = '#0e2118';
export const sub = '#6b756f';
export const cream = '#fbf6e6';
export const paper = '#f7f4ea';
export const rule = '#e2dcc0';

// Named aliases
export const forest = G3;
export const greenDeep = G2;
export const sage = G9;
export const sageLight = '#dde9d4';
export const citron = Y5;

// Accents
export const clay = '#cc6f4a';
export const flax = '#e6c772';
export const peach = '#f1d9cc';
export const flaxLight = '#f3eccd';

// Topo contour stroke
export const topoStroke = '#9eb59a';

// Ring track color on G8 surface
export const ringTrack = 'rgba(29,78,52,0.18)';

// ── Typography ───────────────────────────────────────────────────────
export const FontFamily = {
  outfit: 'Outfit_400Regular',
  outfitMedium: 'Outfit_500Medium',
  outfitSemiBold: 'Outfit_600SemiBold',
  outfitBold: 'Outfit_700Bold',
  outfitExtraBold: 'Outfit_800ExtraBold',
  mono: 'JetBrainsMono_500Medium',
  monoSemiBold: 'JetBrainsMono_600SemiBold',
  monoBold: 'JetBrainsMono_700Bold',
  monoExtraBold: 'JetBrainsMono_800ExtraBold',
} as const;

// Type scale tokens (size / lineHeight / letterSpacing / fontFamily)
export const TypeScale = {
  'display/xxl': { fontSize: 64, lineHeight: 61, letterSpacing: -2.56, fontFamily: FontFamily.outfitExtraBold },
  'display/xl':  { fontSize: 52, lineHeight: 48, letterSpacing: -2.08, fontFamily: FontFamily.outfitExtraBold },
  'display/l':   { fontSize: 44, lineHeight: 42, letterSpacing: -1.54, fontFamily: FontFamily.outfitExtraBold },
  'display/m':   { fontSize: 40, lineHeight: 38, letterSpacing: -1.4, fontFamily: FontFamily.outfitExtraBold },
  'title/l':     { fontSize: 32, lineHeight: 32, letterSpacing: -0.96, fontFamily: FontFamily.outfitExtraBold },
  'title/m':     { fontSize: 26, lineHeight: 26, letterSpacing: -0.78, fontFamily: FontFamily.outfitExtraBold },
  'title/s':     { fontSize: 22, lineHeight: 23, letterSpacing: -0.55, fontFamily: FontFamily.outfitBold },
  'body/lg':     { fontSize: 18, lineHeight: 23, letterSpacing: -0.36, fontFamily: FontFamily.outfitBold },
  'body/md':     { fontSize: 14, lineHeight: 20, letterSpacing: -0.14, fontFamily: FontFamily.outfitBold },
  'body/sm':     { fontSize: 13, lineHeight: 19, letterSpacing: 0, fontFamily: FontFamily.outfitMedium },
  'body/xs':     { fontSize: 12, lineHeight: 17, letterSpacing: 0, fontFamily: FontFamily.outfitSemiBold },
  caption:       { fontSize: 11, lineHeight: 14, letterSpacing: 0.44, fontFamily: FontFamily.outfitExtraBold },
  eyebrow:       { fontSize: 10.5, lineHeight: 13, letterSpacing: 2.31, fontFamily: FontFamily.outfitExtraBold },
} as const;

// ── Spacing ──────────────────────────────────────────────────────────
export const sp = {
  1: 3,
  2: 4,
  3: 6,
  4: 8,
  5: 10,
  6: 12,
  7: 14,
  8: 16,
  9: 18,
  10: 20,
  11: 22,
  12: 26,
} as const;

// ── Radii ────────────────────────────────────────────────────────────
export const radii = {
  pill: 99,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 22,
  cardXs: 24,
  cardM: 26,
  cardL: 28,
  cardXl: 30,
} as const;

// ── Shadows ──────────────────────────────────────────────────────────
type ShadowStyle = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

export const shadows: Record<string, ShadowStyle> = Platform.select({
  ios: {
    row: {
      shadowColor: '#1d4e34',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 14,
      elevation: 2,
    },
    card: {
      shadowColor: '#11371f',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.42,
      shadowRadius: 30,
      elevation: 8,
    },
    cta: {
      shadowColor: '#cfde50',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.35,
      shadowRadius: 22,
      elevation: 6,
    },
    g8: {
      shadowColor: '#11371f',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.20,
      shadowRadius: 30,
      elevation: 6,
    },
    gear: {
      shadowColor: '#1d4e34',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 12,
      elevation: 3,
    },
    tabBar: {
      shadowColor: '#1d4e34',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.30,
      shadowRadius: 30,
      elevation: 8,
    },
    formCard: {
      shadowColor: '#11371f',
      shadowOffset: { width: 0, height: 22 },
      shadowOpacity: 0.18,
      shadowRadius: 40,
      elevation: 8,
    },
  },
  default: {
    row: {
      shadowColor: '#1d4e34',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 14,
      elevation: 2,
    },
    card: {
      shadowColor: '#11371f',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.42,
      shadowRadius: 30,
      elevation: 8,
    },
    cta: {
      shadowColor: '#cfde50',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.35,
      shadowRadius: 22,
      elevation: 6,
    },
    g8: {
      shadowColor: '#11371f',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.20,
      shadowRadius: 30,
      elevation: 6,
    },
    gear: {
      shadowColor: '#1d4e34',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.10,
      shadowRadius: 12,
      elevation: 3,
    },
    tabBar: {
      shadowColor: '#1d4e34',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.30,
      shadowRadius: 30,
      elevation: 8,
    },
    formCard: {
      shadowColor: '#11371f',
      shadowOffset: { width: 0, height: 22 },
      shadowOpacity: 0.18,
      shadowRadius: 40,
      elevation: 8,
    },
  },
})!;

// Ring colors (category → ring color)
export const ringColors = {
  golf: forest,
  workout: clay,
  lifestyle: flax,
} as const;

// Chip colors for queue rows (category → bg + fg)
export const chipColors = {
  golf: { bg: citron, fg: greenDeep },
  workout: { bg: peach, fg: clay },
  lifestyle: { bg: sageLight, fg: forest },
} as const;
