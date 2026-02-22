# Prompt 01 — MD3 Theme Setup

## Task

Create the file `mobile/src/theme/md3Theme.ts` and update `mobile/App.tsx` to use a complete Material Design 3 dual light/dark theme via `react-native-paper`.

---

## File 1: Create `mobile/src/theme/md3Theme.ts`

Create this file from scratch. It must export:

1. `md3LightTheme` — a full MD3 light scheme based on `MD3LightTheme` from `react-native-paper`.
2. `md3DarkTheme` — a full MD3 dark scheme based on `MD3DarkTheme` from `react-native-paper`.
3. `planetColors` — a plain object (not theme-dependent) with planet-specific colors for chart rendering only.
4. `elementColors` — a plain object with the four astrological element colors for chart sector fills only.

```typescript
// mobile/src/theme/md3Theme.ts
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

export const md3LightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Seed: deep violet #6750A4 (MD3 reference purple)
    primary: '#6750A4',
    onPrimary: '#FFFFFF',
    primaryContainer: '#EADDFF',
    onPrimaryContainer: '#21005D',

    secondary: '#958DA5',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E8DEF8',
    onSecondaryContainer: '#1D192B',

    tertiary: '#B58392',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#FFD8E4',
    onTertiaryContainer: '#31111D',

    error: '#B3261E',
    onError: '#FFFFFF',
    errorContainer: '#F9DEDC',
    onErrorContainer: '#410E0B',

    background: '#FFFBFE',
    onBackground: '#1C1B1F',

    surface: '#FFFBFE',
    onSurface: '#1C1B1F',

    surfaceVariant: '#E7E0EC',
    onSurfaceVariant: '#49454F',

    outline: '#79747E',
    outlineVariant: '#CAC4D0',

    inverseSurface: '#313033',
    inverseOnSurface: '#F4EFF4',
    inversePrimary: '#D0BCFF',

    shadow: '#000000',
    scrim: '#000000',

    surfaceDisabled: 'rgba(28, 27, 31, 0.12)',
    onSurfaceDisabled: 'rgba(28, 27, 31, 0.38)',

    backdrop: 'rgba(50, 47, 55, 0.4)',
  },
};

export const md3DarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Dark scheme — same seed #6750A4 generates inverted tonal palette
    primary: '#D0BCFF',
    onPrimary: '#381E72',
    primaryContainer: '#4F378B',
    onPrimaryContainer: '#EADDFF',

    secondary: '#CCC2DC',
    onSecondary: '#332D41',
    secondaryContainer: '#4A4458',
    onSecondaryContainer: '#E8DEF8',

    tertiary: '#EFB8C8',
    onTertiary: '#492532',
    tertiaryContainer: '#633B48',
    onTertiaryContainer: '#FFD8E4',

    error: '#F2B8B5',
    onError: '#601410',
    errorContainer: '#8C1D18',
    onErrorContainer: '#F9DEDC',

    background: '#1C1B1F',
    onBackground: '#E6E1E5',

    surface: '#1C1B1F',
    onSurface: '#E6E1E5',

    surfaceVariant: '#49454F',
    onSurfaceVariant: '#CAC4D0',

    outline: '#938F99',
    outlineVariant: '#49454F',

    inverseSurface: '#E6E1E5',
    inverseOnSurface: '#313033',
    inversePrimary: '#6750A4',

    shadow: '#000000',
    scrim: '#000000',

    surfaceDisabled: 'rgba(230, 225, 229, 0.12)',
    onSurfaceDisabled: 'rgba(230, 225, 229, 0.38)',

    backdrop: 'rgba(50, 47, 55, 0.4)',
  },
};

/** Planet-specific colors for chart glyphs and indicators only. Never use as surface colors. */
export const planetColors = {
  sun:       '#FFD700',
  moon:      '#E0E0E0',
  mars:      '#EF5350',
  mercury:   '#66BB6A',
  jupiter:   '#FFA726',
  venus:     '#EC407A',
  saturn:    '#546E7A',
  rahu:      '#7E57C2',
  ketu:      '#8D6E63',
  ascendant: '#FFEE58',
} as const;

/** Element colors for chart sector fills only. */
export const elementColors = {
  fire:  '#FFCDD2',
  earth: '#C8E6C9',
  air:   '#FFF9C4',
  water: '#BBDEFB',
} as const;
```

---

## File 2: Update `mobile/App.tsx`

The current `App.tsx` uses a manually patched `MD3LightTheme` with only two color overrides and no dark mode support. Replace the theme setup block with the new dual-theme system while keeping all other logic (QueryClient, PersistQueryClientProvider, AuthProvider, useNotifications) exactly as-is.

**Current App.tsx (for reference):**

```tsx
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { registerTranslation, en } from 'react-native-paper-dates';
// ...

registerTranslation('en', en);

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4a148c',
    secondary: '#ff6f00',
  },
};
```

**Required changes to App.tsx:**

1. Remove the `MD3LightTheme` import from `react-native-paper`.
2. Add imports: `MD3DarkTheme` from `react-native-paper` (for type reference), `useColorScheme` from `react-native`.
3. Import `md3LightTheme` and `md3DarkTheme` from `./src/theme/md3Theme`.
4. Remove the `paperTheme` constant.
5. Inside `App()`, read `const colorScheme = useColorScheme();` and derive `const theme = colorScheme === 'dark' ? md3DarkTheme : md3LightTheme;`.
6. Pass `theme` to `<PaperProvider theme={theme}>`.
7. Keep `registerTranslation('en', en)` at module level unchanged.
8. Keep `AppContent`, `queryClient`, `asyncStoragePersister`, and all other code unchanged.

The final `App.tsx` import section should look like:

```tsx
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider } from 'react-native-paper';
import { registerTranslation, en } from 'react-native-paper-dates';
import RootNavigator from './src/navigation/RootNavigator';
import './src/i18n';
import { useNotifications } from './src/hooks/useNotifications';
import { AuthProvider } from './src/context/AuthContext';
import { md3LightTheme, md3DarkTheme } from './src/theme/md3Theme';
```

---

## Validation

After applying these changes:

- `cd mobile && npx expo start` should compile without TypeScript errors.
- The app background should be `#FFFBFE` in light mode and `#1C1B1F` in dark mode.
- All existing functionality (login, navigation, feed) must still work.
