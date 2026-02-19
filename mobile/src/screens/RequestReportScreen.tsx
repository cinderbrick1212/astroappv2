import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useServiceRequest } from '../hooks/useServiceRequest';
import { analytics } from '../services/analytics';

const REPORT_TYPES = [
  { label: 'Full Life Reading', description: 'Comprehensive analysis of all life areas', icon: '📖' },
  { label: 'Career & Finance', description: 'Job, business, and money insights', icon: '💼' },
  { label: 'Love & Marriage', description: 'Relationship timing and compatibility', icon: '❤️' },
  { label: 'Health & Wellness', description: 'Physical and mental well-being guidance', icon: '🌿' },
  { label: 'Annual Forecast', description: 'Year-ahead planetary predictions', icon: '🗓️' },
];

const RequestReportScreen: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [notes, setNotes] = useState('');
  const { createRequest, isCreating } = useServiceRequest();

  const handleSubmit = () => {
    if (!selectedReport) {
      Alert.alert('Select Report', 'Please select a report type.');
      return;
    }
    createRequest(
      {
        service_type: 'report',
        user_notes: `Report type: ${selectedReport}${notes ? `\nAdditional notes: ${notes}` : ''}`,
      },
      {
        onSuccess: () => {
          analytics.reportRequested(selectedReport);
          Alert.alert(
            'Report Requested',
            'Your report request has been received. Our astrologer will prepare it within 48 hours.',
            [{ text: 'OK' }]
          );
          setSelectedReport('');
          setNotes('');
        },
        onError: () => {
          Alert.alert('Error', 'Could not submit report request. Please try again.');
        },
      }
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <Text style={styles.icon}>📋</Text>
        <Text style={styles.title}>Request a Report</Text>
        <Text style={styles.subtitle}>
          Get a detailed PDF report from an expert astrologer, delivered within 48 hours.
        </Text>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>₹299</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Select Report Type</Text>
          {REPORT_TYPES.map(rt => (
            <TouchableOpacity
              key={rt.label}
              style={[
                styles.reportOption,
                selectedReport === rt.label && styles.reportOptionActive,
              ]}
              onPress={() => setSelectedReport(rt.label)}
            >
              <Text style={styles.reportIcon}>{rt.icon}</Text>
              <View style={styles.reportInfo}>
                <Text
                  style={[
                    styles.reportLabel,
                    selectedReport === rt.label && styles.reportLabelActive,
                  ]}
                >
                  {rt.label}
                </Text>
                <Text style={styles.reportDescription}>{rt.description}</Text>
              </View>
              {selectedReport === rt.label && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.formLabel}>Additional Notes (optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Any specific questions or areas you want covered…"
            placeholderTextColor={colors.textTertiary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isCreating && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isCreating}
        >
          <Text style={styles.submitButtonText}>
            {isCreating ? 'Submitting...' : 'Request Report'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Reports are delivered as a PDF to the app within 48 hours of submission.
        </Text>
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
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  priceBadge: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  priceText: {
    color: colors.textOnPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  formSection: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  reportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  reportOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight + '18',
  },
  reportIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  reportInfo: {
    flex: 1,
  },
  reportLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  reportLabelActive: {
    color: colors.primary,
  },
  reportDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  checkmark: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
  },
  textArea: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 80,
  },
  submitButton: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  submitButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
});

export default RequestReportScreen;
