import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types';
import MainNavigator from './MainNavigator';
import KundliScreen from '../screens/KundliScreen';
import CompatibilityScreen from '../screens/CompatibilityScreen';
import PanchangScreen from '../screens/PanchangScreen';
import AskQuestionScreen from '../screens/AskQuestionScreen';
import RequestReportScreen from '../screens/RequestReportScreen';
import BlogListScreen from '../screens/BlogListScreen';
import BlogPostScreen from '../screens/BlogPostScreen';
import BookCallScreen from '../screens/BookCallScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Kundli"
        component={KundliScreen}
        options={{ presentation: 'modal', title: 'Your Kundli', headerShown: true }}
      />
      <Stack.Screen
        name="Compatibility"
        component={CompatibilityScreen}
        options={{ presentation: 'modal', title: 'Compatibility', headerShown: true }}
      />
      <Stack.Screen
        name="Panchang"
        component={PanchangScreen}
        options={{ presentation: 'modal', title: 'Daily Panchang', headerShown: true }}
      />
      <Stack.Screen
        name="AskQuestion"
        component={AskQuestionScreen}
        options={{ presentation: 'modal', title: 'Ask a Question', headerShown: true }}
      />
      <Stack.Screen
        name="RequestReport"
        component={RequestReportScreen}
        options={{ presentation: 'modal', title: 'Request a Report', headerShown: true }}
      />
      <Stack.Screen
        name="BlogList"
        component={BlogListScreen}
        options={{ presentation: 'modal', title: 'Blog', headerShown: true }}
      />
      <Stack.Screen
        name="BlogPost"
        component={BlogPostScreen}
        options={{ presentation: 'modal', title: '', headerShown: true }}
      />
      <Stack.Screen
        name="BookCall"
        component={BookCallScreen}
        options={{ presentation: 'modal', title: 'Book a Call', headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
