import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const LoginScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <Text style={styles.subtitle}>TODO: Implement Firebase authentication</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default LoginScreen;
