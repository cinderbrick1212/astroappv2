import React from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider as PaperProvider } from 'react-native-paper';
import { registerTranslation, en } from 'react-native-paper-dates';
import RootNavigator from './src/navigation/RootNavigator';
import './src/i18n'; // initialise i18next before any components render
import { useNotifications } from './src/hooks/useNotifications';
import { AuthProvider } from './src/context/AuthContext';
import { md3LightTheme, md3DarkTheme } from './src/theme/md3Theme';

registerTranslation('en', en);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours – keep cache alive offline
      networkMode: 'offlineFirst',
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'REACT_QUERY_CACHE',
});

function AppContent() {
  useNotifications();
  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? md3DarkTheme : md3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: asyncStoragePersister }}
      >
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </PersistQueryClientProvider>
    </PaperProvider>
  );
}
