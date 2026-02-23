import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Button,
  Chip,
  useTheme,
} from 'react-native-paper';
import { useServiceRequest } from '../hooks/useServiceRequest';

const BookCallScreen: React.FC = () => {
  const theme = useTheme();
  const [notes, setNotes] = useState('');
  const { createRequest, isCreating } = useServiceRequest();

  const handleSubmit = () => {
    createRequest(
      { service_type: 'call', user_notes: notes.trim() },
      {
        onSuccess: () => {
          Alert.alert(
            'Call Request Submitted',
            'Your call request has been submitted. An astrologer will contact you to confirm the appointment.',
            [{ text: 'OK' }]
          );
          setNotes('');
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
            Book a Call
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 8, opacity: 0.85 }}
          >
            Live 30-minute consultation with an expert astrologer.
          </Text>
          <Chip
            mode="flat"
            style={[styles.priceChip, { backgroundColor: theme.colors.secondary }]}
            textStyle={{ color: theme.colors.onSecondary, fontWeight: 'bold', fontSize: 16 }}
            accessibilityLabel="Price: 999 rupees"
          >
            ₹999
          </Chip>
        </Card.Content>
      </Card>

      {/* Notes input */}
      <View style={styles.formSection}>
        <TextInput
          mode="outlined"
          label="Preferred date/time or additional notes (optional)"
          placeholder="e.g. Prefer weekday evenings, IST timezone"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={4}
          style={styles.textArea}
          theme={theme}
          accessibilityLabel="Enter preferred time or notes"
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isCreating}
          disabled={isCreating}
          style={styles.submitButton}
          contentStyle={styles.buttonContent}
          accessibilityLabel="Submit call booking request"
        >
          Request Call
        </Button>

        <Text
          variant="bodySmall"
          style={[styles.disclaimer, { color: theme.colors.onSurfaceVariant }]}
        >
          Payment will be collected at the time of confirmation. You will receive a call within 24 hours to schedule.
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

export default BookCallScreen;
