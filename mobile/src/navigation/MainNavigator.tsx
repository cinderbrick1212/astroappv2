import React, { useCallback, useState } from 'react';
import { BottomNavigation, useTheme } from 'react-native-paper';
import {
  Compass,
  House,
  UserCircle,
} from 'phosphor-react-native';
import type { IconWeight } from 'phosphor-react-native';
import HomeScreen from '../screens/HomeScreen';
import ToolsScreen from '../screens/ToolsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

type Route = {
  key: string;
  title: string;
  focusedIcon: string;   // kept for Paper API compat
  unfocusedIcon?: string;
};

// We will merge DailyFeed into HomeScreen directly, so 'home' becomes the main dashboard.
const renderScene = BottomNavigation.SceneMap({
  home: HomeScreen,
  tools: ToolsScreen,
  profile: ProfileScreen,
});

const routes: Route[] = [
  { key: 'home', title: 'Home', focusedIcon: 'house', unfocusedIcon: 'house' },
  { key: 'tools', title: 'Astro Hub', focusedIcon: 'compass', unfocusedIcon: 'compass' },
  { key: 'profile', title: 'Profile', focusedIcon: 'user-circle', unfocusedIcon: 'user-circle' },
];

// Map route keys → Phosphor components
const ROUTE_ICONS: Record<string, React.ComponentType<any>> = {
  home: House,
  tools: Compass,
  profile: UserCircle,
};

const MainNavigator: React.FC = () => {
  const [index, setIndex] = useState(0);
  const theme = useTheme();
  // Fetch the safe area insets to pad the bottom tab bar correctly against Android software buttons / iOS home indicator
  const insets = useSafeAreaInsets();

  const renderIcon = useCallback(
    ({ route, focused, color }: { route: Route; focused: boolean; color: string }) => {
      const Icon = ROUTE_ICONS[route.key] || House;
      const weight: IconWeight = focused ? 'fill' : 'regular';
      return (
        <Icon
          size={24}
          color={color}
          weight={weight}
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
      safeAreaInsets={{
        bottom: Platform.OS === 'android' ? Math.max(insets.bottom, 8) + 8 : Math.max(insets.bottom, 16),
        top: 0
      }}
      barStyle={{
        backgroundColor: theme.colors.surface,
      }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
      activeIndicatorStyle={{ backgroundColor: theme.colors.secondaryContainer }}
      theme={theme}
    />
  );
};

export default MainNavigator;
