import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Button,
  Chip,
  SegmentedButtons,
  useTheme,
} from 'react-native-paper';
import { useServiceRequest } from '../hooks/useServiceRequest';

type ReportType = 'career' | 'marriage' | 'finance';

const REPORT_TYPES: Array<{ value: ReportType; label: string }> = [
  { value: 'career',   label: 'Career' },
  { value: 'marriage', label: 'Marriage' },
  { value: 'finance',  label: 'Finance' },
];

const RequestReportScreen: React.FC = () => {
  const theme = useTheme();
  const [reportType, setReportType] = useState<ReportType>('career');
  const [notes, setNotes] = useState('');
  const { createRequest, isCreating } = useServiceRequest();

  const handleSubmit = () => {
    createRequest(
      {
        service_type: 'report',
        user_notes: notes.trim() ? `Report type: ${reportType}. ${notes.trim()}` : `Report type: ${reportType}`,
      },
      {
        onSuccess: () => {
          Alert.alert(
            'Report Requested',
            'Your report request has been submitted. You will receive your PDF report within 48 hours.',
            [{ text: 'OK' }]
          );
          setNotes('');
          setReportType('career');
        },
        onError: () => {
          Alert.alert('Error', 'Could not submit request. Please try again.');
        },
      }
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      {/* Hero card */}
      <Card
        mode="contained"
        style={[styles.heroCard, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <Card.Content style={styles.heroContent}>
          <Text variant="headlineMedium" style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center' }}>
            Request a Report
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 8, opacity: 0.85 }}
          >
            In-depth PDF analysis of your chosen life area. Delivered within 48 hours.
          </Text>
          <Chip
            mode="flat"
            style={[styles.priceChip, { backgroundColor: theme.colors.secondary }]}
            textStyle={{ color: theme.colors.onSecondary, fontWeight: 'bold', fontSize: 16 }}
            accessibilityLabel="Price: 299 rupees"
          >
            ₹299
          </Chip>
        </Card.Content>
      </Card>

      {/* Report type selector */}
      <View style={styles.formSection}>
        <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
          Report Type
        </Text>
        <SegmentedButtons
          value={reportType}
          onValueChange={v => setReportType(v as ReportType)}
          buttons={REPORT_TYPES}
          theme={theme}
        />

        <TextInput
          mode="outlined"
          label="Additional notes (optional)"
          placeholder="e.g. Specific concerns or questions for the astrologer"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          style={[styles.textArea, { marginTop: 16 }]}
          theme={theme}
          accessibilityLabel="Enter additional notes for your report"
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isCreating}
          disabled={isCreating}
          style={styles.submitButton}
          contentStyle={styles.buttonContent}
          accessibilityLabel="Submit report request"
        >
          Request Report
        </Button>

        <Text
          variant="bodySmall"
          style={[styles.disclaimer, { color: theme.colors.onSurfaceVariant }]}
        >
          Payment will be collected upon confirmation. Report is delivered as a PDF within 48 hours.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container:    { flex: 1 },
  heroCard:     { margin: 16, marginBottom: 0 },
  heroContent:  { alignItems: 'center', paddingVertical: 20 },
  priceChip:    { marginTop: 12 },
  formSection:  { padding: 16 },
  textArea:     { minHeight: 100 },
  submitButton: { marginTop: 12 },
  buttonContent:{ paddingVertical: 6 },
  disclaimer:   { textAlign: 'center', marginTop: 12, lineHeight: 18 },
});

export default RequestReportScreen;
