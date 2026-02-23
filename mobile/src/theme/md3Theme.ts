import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// ── Premium "Mystic Modern" font configuration ───────────────────────────────

const fontConfig = {
  displayLarge: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 57, lineHeight: 64, letterSpacing: -0.25 },
  displayMedium: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 45, lineHeight: 52, letterSpacing: 0 },
  displaySmall: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 36, lineHeight: 44, letterSpacing: 0 },
  headlineLarge: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 32, lineHeight: 40, letterSpacing: 0 },
  headlineMedium: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 28, lineHeight: 36, letterSpacing: 0 },
  headlineSmall: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 24, lineHeight: 32, letterSpacing: 0 },
  titleLarge: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 22, lineHeight: 28, letterSpacing: 0 },
  titleMedium: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 16, lineHeight: 24, letterSpacing: 0.15 },
  titleSmall: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
  bodyLarge: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 16, lineHeight: 24, letterSpacing: 0.5 },
  bodyMedium: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, lineHeight: 20, letterSpacing: 0.25 },
  bodySmall: { fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, lineHeight: 16, letterSpacing: 0.4 },
  labelLarge: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
  labelMedium: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 12, lineHeight: 16, letterSpacing: 0.5 },
  labelSmall: { fontFamily: 'PlusJakartaSans_500Medium', fontSize: 11, lineHeight: 16, letterSpacing: 0.5 },
} as const;

// ── Cosmic Indigo + Amber "Vedic Luxe" palette (refined) ─────────────────────

export const md3LightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 16,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#5B4FC4',            // Indigo-violet
    onPrimary: '#FFFFFF',
    primaryContainer: '#E6DEFF',   // Lavender tint
    onPrimaryContainer: '#180065',
    secondary: '#C77D00',          // Deep amber
    onSecondary: '#FFFFFF',
    secondaryContainer: '#FFDDB3', // Warm gold tint
    onSecondaryContainer: '#261900',
    tertiary: '#9C4175',           // Mystic rose
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFD8E8',
    onTertiaryContainer: '#3E002D',
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    background: '#FDF7FF',         // Near-white lilac
    onBackground: '#1C1B20',
    surface: '#FDF7FF',
    onSurface: '#1C1B20',
    surfaceVariant: '#E8E0F0',
    onSurfaceVariant: '#49454E',
    outline: '#7A757F',
    outlineVariant: '#CBC5D0',
    inverseSurface: '#322F35',
    inverseOnSurface: '#F5EFF7',
    inversePrimary: '#CBBEFF',
    shadow: '#000000',
    scrim: '#000000',
    surfaceDisabled: 'rgba(28, 27, 32, 0.12)',
    onSurfaceDisabled: 'rgba(28, 27, 32, 0.38)',
    backdrop: 'rgba(50, 47, 55, 0.4)',
    elevation: {
      level0: 'transparent',
      level1: '#F7F2FA',
      level2: '#F2ECF6',
      level3: '#EDE7F2',
      level4: '#EBE5F0',
      level5: '#E8E1ED',
    },
  },
};

export const md3DarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 16,
  fonts: configureFonts({ config: fontConfig }),
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#CBBEFF',             // Soft lavender
    onPrimary: '#2D1B7A',
    primaryContainer: '#362D8A',    // Deep indigo ← enriched
    onPrimaryContainer: '#E6DEFF',
    secondary: '#FFC044',           // Warm rich gold ← brightened
    onSecondary: '#422C00',
    secondaryContainer: '#5E4200',  // Dark amber
    onSecondaryContainer: '#FFDDB3',
    tertiary: '#FFB0D0',            // Soft pink
    onTertiary: '#5E1045',
    tertiaryContainer: '#7C295C',
    onTertiaryContainer: '#FFD8E8',
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    background: '#0D0B14',          // Deepened cosmic black ← richer
    onBackground: '#E8E2EC',
    surface: '#0D0B14',
    onSurface: '#E8E2EC',
    surfaceVariant: '#49454E',
    onSurfaceVariant: '#CBC5D0',
    outline: '#958F9A',
    outlineVariant: '#49454E',
    inverseSurface: '#E8E2EC',
    inverseOnSurface: '#322F35',
    inversePrimary: '#5B4FC4',
    shadow: '#000000',
    scrim: '#000000',
    surfaceDisabled: 'rgba(232, 226, 236, 0.12)',
    onSurfaceDisabled: 'rgba(232, 226, 236, 0.38)',
    backdrop: 'rgba(50, 47, 55, 0.4)',
    elevation: {
      level0: 'transparent',
      level1: '#17142150',          // Subtle tonal lift
      level2: '#1E1A2C',           // Visible card surface
      level3: '#252139',           // Higher elevation
      level4: '#282441',           // Modal/drawer surface
      level5: '#2F2A4A',           // Highest surface
    },
  },
};

// ── Gradient presets for "Mystic Modern" aesthetic ──────────────────────────

export const gradients = {
  cosmicHero: ['#0D0B14', '#1A1140', '#2D1B6E'],          // Deep space → indigo
  primaryGlow: ['#362D8A', '#5B4FC4', '#7B6FDD'],          // Indigo shimmer
  goldenAccent: ['#5E4200', '#C77D00', '#FFC044'],          // Amber warmth
  mysticRose: ['#3E002D', '#7C295C', '#9C4175'],          // Rose journey
  cardSubtle: ['rgba(54,45,138,0.15)', 'rgba(54,45,138,0.05)'], // For card overlays
} as const;

export const planetColors = {
  sun: '#FFB300',
  moon: '#B0BEC5',
  mars: '#E53935',
  mercury: '#43A047',
  jupiter: '#FB8C00',
  venus: '#D81B60',
  saturn: '#546E7A',
  rahu: '#7E57C2',
  ketu: '#8D6E63',
  ascendant: '#FFEE58',
} as const;

export const elementColors = {
  fire: '#FFCDD2',
  earth: '#C8E6C9',
  air: '#FFF9C4',
  water: '#BBDEFB',
} as const;
