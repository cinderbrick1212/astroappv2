import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const ToolsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Astrology Tools</Text>
        <Text style={styles.subtitle}>TODO: Implement tools hub</Text>
        <Text style={styles.subtitle}>• Kundli Lite</Text>
        <Text style={styles.subtitle}>• Compatibility</Text>
        <Text style={styles.subtitle}>• Panchang</Text>
        <Text style={styles.subtitle}>• Lucky Factors</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
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
    marginBottom: spacing.sm,
  },
});

export default ToolsScreen;
