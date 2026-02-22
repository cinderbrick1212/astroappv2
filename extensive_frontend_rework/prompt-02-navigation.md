# Prompt 02 — Navigation: Replace Bottom Tabs with MD3 BottomNavigation

## Task

Rewrite `mobile/src/navigation/MainNavigator.tsx` to use `react-native-paper`'s `BottomNavigation` component instead of `@react-navigation/bottom-tabs`. This gives the correct Material Design 3 navigation bar with animated indicator pill, MD3 color roles, and accessible labels.

---

## Context

**Current file:** `mobile/src/navigation/MainNavigator.tsx`

The current implementation uses `createBottomTabNavigator` from `@react-navigation/bottom-tabs` and renders emoji characters as tab icons — which is not MD3-compliant.

**Current content for reference:**
```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
// ...emoji-based tabBarIcon functions
```

---

## Required Implementation

Rewrite `mobile/src/navigation/MainNavigator.tsx` completely to:

1. Use `BottomNavigation` from `react-native-paper` with `BottomNavigation.SceneMap`.
2. Use `MaterialCommunityIcons` from `@expo/vector-icons` for all tab icons — **not** emoji strings.
3. Keep the same 4 tabs in the same order: Feed, Tools, Home, Profile.
4. Remove the `@react-navigation/bottom-tabs` import entirely.
5. Use `useTheme()` from `react-native-paper` to apply MD3 colors to the navigation bar — do not hardcode any colors.

**Icon names to use:**
- Feed tab: focused → `'calendar-today'`, unfocused → `'calendar-today-outline'` (fall back to `'calendar-today'` if outline unavailable)
- Tools tab: focused → `'compass'`, unfocused → `'compass-outline'`
- Home tab: focused → `'home'`, unfocused → `'home-outline'`
- Profile tab: focused → `'account-circle'`, unfocused → `'account-circle-outline'`

**Complete rewrite:**

```tsx
import React, { useState, useCallback } from 'react';
import { BottomNavigation, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DailyFeedScreen from '../screens/DailyFeedScreen';
import ToolsScreen from '../screens/ToolsScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

type Route = {
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon?: string;
};

const renderScene = BottomNavigation.SceneMap({
  feed:    DailyFeedScreen,
  tools:   ToolsScreen,
  home:    HomeScreen,
  profile: ProfileScreen,
});

const routes: Route[] = [
  { key: 'feed',    title: 'Today',   focusedIcon: 'calendar-today',      unfocusedIcon: 'calendar-today-outline' },
  { key: 'tools',   title: 'Tools',   focusedIcon: 'compass',             unfocusedIcon: 'compass-outline' },
  { key: 'home',    title: 'Home',    focusedIcon: 'home',                unfocusedIcon: 'home-outline' },
  { key: 'profile', title: 'Profile', focusedIcon: 'account-circle',      unfocusedIcon: 'account-circle-outline' },
];

const MainNavigator: React.FC = () => {
  const [index, setIndex] = useState(0);
  const theme = useTheme();

  const renderIcon = useCallback(
    ({
      route,
      focused,
      color,
    }: {
      route: Route;
      focused: boolean;
      color: string;
    }) => {
      const iconName = focused
        ? route.focusedIcon
        : (route.unfocusedIcon ?? route.focusedIcon);
      return (
        <MaterialCommunityIcons
          name={iconName as any}
          size={24}
          color={color}
          accessibilityLabel={route.title}
        />
      );
    },
    []
  );

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={renderIcon}
      barStyle={{ backgroundColor: theme.colors.surface }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
      activeIndicatorStyle={{ backgroundColor: theme.colors.secondaryContainer }}
      theme={theme}
    />
  );
};

export default MainNavigator;
```

---

## Notes

- `BottomNavigation` from `react-native-paper` is self-contained — it manages its own `SafeAreaView` padding on iOS. Remove any manual safe area padding that was previously applied by the tab navigator.
- The existing `AppNavigator.tsx` wraps `MainNavigator` inside a `createNativeStackNavigator`. This remains unchanged — only `MainNavigator.tsx` changes.
- The `MainTabParamList` type in `types/index.ts` is no longer directly used by this navigator (Paper's `BottomNavigation` does not use React Navigation's tab param list), but keep it in `types/index.ts` as it may be referenced elsewhere.
- `@expo/vector-icons` is available in Expo SDK 54 without any additional installation.

---

## Validation

- All 4 tabs are accessible and navigable.
- The active tab indicator shows the correct MD3 pill shape.
- Tab icons render as vector icons (not emoji).
- No TypeScript errors.
