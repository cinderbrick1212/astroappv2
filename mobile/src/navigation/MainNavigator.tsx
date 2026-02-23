import React, { useCallback, useState } from 'react';
import { BottomNavigation, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DailyFeedScreen from '../screens/DailyFeedScreen';
import ToolsScreen from '../screens/ToolsScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type Route = {
  key: string;
  title: string;
  focusedIcon: IconName;
  unfocusedIcon?: IconName;
};

const renderScene = BottomNavigation.SceneMap({
  feed: DailyFeedScreen,
  tools: ToolsScreen,
  home: HomeScreen,
  profile: ProfileScreen,
});

const routes: Route[] = [
  { key: 'feed', title: 'Today', focusedIcon: 'calendar-today', unfocusedIcon: 'calendar-today-outline' },
  { key: 'tools', title: 'Tools', focusedIcon: 'compass', unfocusedIcon: 'compass-outline' },
  { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
  { key: 'profile', title: 'Profile', focusedIcon: 'account-circle', unfocusedIcon: 'account-circle-outline' },
];

const MainNavigator: React.FC = () => {
  const [index, setIndex] = useState(0);
  const theme = useTheme();

  const renderIcon = useCallback(
    ({ route, focused, color }: { route: Route; focused: boolean; color: string }) => {
      const iconName = focused ? route.focusedIcon : (route.unfocusedIcon ?? route.focusedIcon);
      return (
        <MaterialCommunityIcons
          name={iconName}
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
