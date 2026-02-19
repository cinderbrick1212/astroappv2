import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const OfflineBanner: React.FC = () => {
  const { isConnected } = useNetworkStatus();

  if (isConnected !== false) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>📶 You are offline — showing cached data</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.error,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default OfflineBanner;
