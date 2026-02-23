import React, { useCallback, useState } from 'react';
import { BottomNavigation, useTheme } from 'react-native-paper';
import {
  CalendarDots,
  Compass,
  House,
  UserCircle,
} from 'phosphor-react-native';
import type { IconWeight } from 'phosphor-react-native';
import DailyFeedScreen from '../screens/DailyFeedScreen';
import ToolsScreen from '../screens/ToolsScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

type Route = {
  key: string;
  title: string;
  focusedIcon: string;   // kept for Paper API compat
  unfocusedIcon?: string;
};

const renderScene = BottomNavigation.SceneMap({
  feed: DailyFeedScreen,
  tools: ToolsScreen,
  home: HomeScreen,
  profile: ProfileScreen,
});

const routes: Route[] = [
  { key: 'feed', title: 'Today', focusedIcon: 'calendar-dots', unfocusedIcon: 'calendar-dots' },
  { key: 'tools', title: 'Tools', focusedIcon: 'compass', unfocusedIcon: 'compass' },
  { key: 'home', title: 'Home', focusedIcon: 'house', unfocusedIcon: 'house' },
  { key: 'profile', title: 'Profile', focusedIcon: 'user-circle', unfocusedIcon: 'user-circle' },
];

// Map route keys → Phosphor components
const ROUTE_ICONS: Record<string, React.ComponentType<any>> = {
  feed: CalendarDots,
  tools: Compass,
  home: House,
  profile: UserCircle,
};

const MainNavigator: React.FC = () => {
  const [index, setIndex] = useState(0);
  const theme = useTheme();

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
      barStyle={{ backgroundColor: theme.colors.surface }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
      activeIndicatorStyle={{ backgroundColor: theme.colors.secondaryContainer }}
      theme={theme}
    />
  );
};

export default MainNavigator;
