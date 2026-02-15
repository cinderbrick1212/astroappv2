import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';
import DailyFeedScreen from '../screens/DailyFeedScreen';
import ToolsScreen from '../screens/ToolsScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

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
          // TODO: Add icon
        }}
      />
      <Tab.Screen 
        name="Tools" 
        component={ToolsScreen}
        options={{
          tabBarLabel: 'Tools',
          // TODO: Add icon
        }}
      />
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          // TODO: Add icon
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          // TODO: Add icon
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
