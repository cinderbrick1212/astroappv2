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

const TIME_SLOTS = ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

const BookCallScreen: React.FC = () => {
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');
  const { createRequest, isCreating } = useServiceRequest();

  const handleSubmit = () => {
    if (!preferredTime) {
      Alert.alert('Select Time', 'Please select a preferred call time.');
      return;
    }
    createRequest(
      {
        service_type: 'call',
        user_notes: `Preferred time: ${preferredTime}${notes ? `\nNotes: ${notes}` : ''}`,
      },
      {
        onSuccess: () => {
          Alert.alert(
            'Call Booked',
            "Your call has been booked. An astrologer will confirm the appointment shortly.",
            [{ text: 'OK' }]
          );
          setPreferredTime('');
          setNotes('');
        },
        onError: () => {
          Alert.alert('Error', 'Could not book call. Please try again.');
        },
      }
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <Text style={styles.icon}>📞</Text>
        <Text style={styles.title}>Book a Call</Text>
        <Text style={styles.subtitle}>
          1-on-1 consultation with an expert astrologer. Duration: 30 minutes.
        </Text>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>₹999</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Preferred Time Slot</Text>
          <View style={styles.timeSlots}>
            {TIME_SLOTS.map(slot => (
              <TouchableOpacity
                key={slot}
                style={[styles.timeSlot, preferredTime === slot && styles.timeSlotActive]}
                onPress={() => setPreferredTime(slot)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    preferredTime === slot && styles.timeSlotTextActive,
                  ]}
                >
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Questions / Notes (optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Topics you'd like to discuss..."
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
            {isCreating ? 'Booking...' : 'Book Call'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          An astrologer will confirm the appointment and provide a call link within a few hours.
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
  inputGroup: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeSlot: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  timeSlotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  timeSlotTextActive: {
    color: colors.textOnPrimary,
    fontWeight: '600',
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

export default BookCallScreen;
