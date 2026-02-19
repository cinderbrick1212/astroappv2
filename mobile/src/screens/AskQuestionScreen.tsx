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

const AskQuestionScreen: React.FC = () => {
  const [question, setQuestion] = useState('');
  const { createRequest, isCreating } = useServiceRequest();

  const handleSubmit = () => {
    if (question.trim().length < 10) {
      Alert.alert('Question too short', 'Please enter at least 10 characters.');
      return;
    }
    createRequest(
      { service_type: 'question', user_notes: question.trim() },
      {
        onSuccess: () => {
          Alert.alert(
            'Question Submitted',
            "Your question has been submitted. You'll receive an answer within 24 hours.",
            [{ text: 'OK' }]
          );
          setQuestion('');
        },
        onError: () => {
          Alert.alert('Error', 'Could not submit question. Please try again.');
        },
      }
    );
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <Text style={styles.icon}>❓</Text>
        <Text style={styles.title}>Ask a Question</Text>
        <Text style={styles.subtitle}>
          Get a personalized answer from an expert astrologer within 24 hours.
        </Text>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>₹49</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Your Question</Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g. When is the right time for me to start a new business?"
            placeholderTextColor={colors.textTertiary}
            value={question}
            onChangeText={setQuestion}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{question.length} characters</Text>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isCreating && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isCreating}
        >
          <Text style={styles.submitButtonText}>
            {isCreating ? 'Submitting...' : 'Submit Question'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Payment will be collected upon confirmation. Our astrologers typically respond within 24 hours.
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
    marginBottom: spacing.xs,
  },
  textArea: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
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

export default AskQuestionScreen;
