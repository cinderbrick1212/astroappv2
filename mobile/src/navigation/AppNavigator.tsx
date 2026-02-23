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
import JanmaKundliScreen from '../screens/JanmaKundliScreen';
import KundliMilanScreen from '../screens/KundliMilanScreen';
import DashaScreen from '../screens/DashaScreen';
import GocharScreen from '../screens/GocharScreen';
import VarshaphalScreen from '../screens/VarshaphalScreen';
import VargaChartsScreen from '../screens/VargaChartsScreen';
import PanchangVisheshScreen from '../screens/PanchangVisheshScreen';
import MuhurtaScreen from '../screens/MuhurtaScreen';
import TithiChandraScreen from '../screens/TithiChandraScreen';
import NakshatraScreen from '../screens/NakshatraScreen';
import GrahanScreen from '../screens/GrahanScreen';
import AshtakavargaScreen from '../screens/AshtakavargaScreen';
import PrashnaScreen from '../screens/PrashnaScreen';
import HoraScreen from '../screens/HoraScreen';
import GrahaShantScreen from '../screens/GrahaShantScreen';
import DainikRashifalScreen from '../screens/DainikRashifalScreen';

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
      <Stack.Screen
        name="JanmaKundli"
        component={JanmaKundliScreen}
        options={{ presentation: 'modal', title: 'Janma Kundli', headerShown: true }}
      />
      <Stack.Screen
        name="KundliMilan"
        component={KundliMilanScreen}
        options={{ presentation: 'modal', title: 'Kundli Milan', headerShown: true }}
      />
      <Stack.Screen
        name="Dasha"
        component={DashaScreen}
        options={{ presentation: 'modal', title: 'Vimshottari Dasha', headerShown: true }}
      />
      <Stack.Screen
        name="Gochar"
        component={GocharScreen}
        options={{ presentation: 'modal', title: 'Gochar — Transits', headerShown: true }}
      />
      <Stack.Screen
        name="Varshaphal"
        component={VarshaphalScreen}
        options={{ presentation: 'modal', title: 'Varshaphal', headerShown: true }}
      />
      <Stack.Screen
        name="VargaCharts"
        component={VargaChartsScreen}
        options={{ presentation: 'modal', title: 'Varga Charts', headerShown: true }}
      />
      <Stack.Screen
        name="PanchangVishesh"
        component={PanchangVisheshScreen}
        options={{ presentation: 'modal', title: 'Panchang Vishesh', headerShown: true }}
      />
      <Stack.Screen
        name="Muhurta"
        component={MuhurtaScreen}
        options={{ presentation: 'modal', title: 'Muhurta', headerShown: true }}
      />
      <Stack.Screen
        name="TithiChandra"
        component={TithiChandraScreen}
        options={{ presentation: 'modal', title: 'Tithi & Chandra', headerShown: true }}
      />
      <Stack.Screen
        name="NakshatraVishesh"
        component={NakshatraScreen}
        options={{ presentation: 'modal', title: 'Nakshatra Vishesh', headerShown: true }}
      />
      <Stack.Screen
        name="Grahan"
        component={GrahanScreen}
        options={{ presentation: 'modal', title: 'Grahan — Eclipses', headerShown: true }}
      />
      <Stack.Screen
        name="Ashtakavarga"
        component={AshtakavargaScreen}
        options={{ presentation: 'modal', title: 'Ashtakavarga', headerShown: true }}
      />
      <Stack.Screen
        name="Prashna"
        component={PrashnaScreen}
        options={{ presentation: 'modal', title: 'Prashna — Horary', headerShown: true }}
      />
      <Stack.Screen
        name="Hora"
        component={HoraScreen}
        options={{ presentation: 'modal', title: 'Hora', headerShown: true }}
      />
      <Stack.Screen
        name="GrahaShanti"
        component={GrahaShantScreen}
        options={{ presentation: 'modal', title: 'Graha Shanti', headerShown: true }}
      />
      <Stack.Screen
        name="DainikRashifal"
        component={DainikRashifalScreen}
        options={{ presentation: 'modal', title: 'Dainik Rashifal', headerShown: true }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
