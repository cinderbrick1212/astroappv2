import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { MainTabParamList } from '../types';
import DailyFeedScreen from '../screens/DailyFeedScreen';
import ToolsScreen from '../screens/ToolsScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcon = (icon: string) =>
  ({ color }: { color: string }) => (
    <Text style={{ fontSize: 22, color }}>{icon}</Text>
  );

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4a148c',
        tabBarInactiveTintColor: '#757575',
      }}
    >
      <Tab.Screen
        name="Feed"
        component={DailyFeedScreen}
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: tabIcon('📅'),
        }}
      />
      <Tab.Screen
        name="Tools"
        component={ToolsScreen}
        options={{
          tabBarLabel: 'Tools',
          tabBarIcon: tabIcon('🔮'),
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: tabIcon('🏠'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: tabIcon('👤'),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
