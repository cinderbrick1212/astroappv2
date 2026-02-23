import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

// ── Cosmic Indigo + Amber "Vedic Luxe" palette ──────────────────────────────

export const md3LightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 16,
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
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#CBBEFF',            // Soft lavender
    onPrimary: '#2D1B7A',
    primaryContainer: '#443AAB',   // Deep indigo
    onPrimaryContainer: '#E6DEFF',
    secondary: '#FFB951',          // Warm amber
    onSecondary: '#422C00',
    secondaryContainer: '#5E4200', // Dark amber
    onSecondaryContainer: '#FFDDB3',
    tertiary: '#FFB0D0',           // Soft pink
    onTertiary: '#5E1045',
    tertiaryContainer: '#7C295C',
    onTertiaryContainer: '#FFD8E8',
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    background: '#141218',         // Deep space
    onBackground: '#E6E1E6',
    surface: '#141218',
    onSurface: '#E6E1E6',
    surfaceVariant: '#49454E',
    onSurfaceVariant: '#CBC5D0',
    outline: '#958F9A',
    outlineVariant: '#49454E',
    inverseSurface: '#E6E1E6',
    inverseOnSurface: '#322F35',
    inversePrimary: '#5B4FC4',
    shadow: '#000000',
    scrim: '#000000',
    surfaceDisabled: 'rgba(230, 225, 230, 0.12)',
    onSurfaceDisabled: 'rgba(230, 225, 230, 0.38)',
    backdrop: 'rgba(50, 47, 55, 0.4)',
    elevation: {
      level0: 'transparent',
      level1: '#1D1A25',
      level2: '#22202D',
      level3: '#272434',
      level4: '#282637',
      level5: '#2C293C',
    },
  },
};

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
