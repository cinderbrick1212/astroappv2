import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import {
  Text,
  Card,
  TextInput,
  Button,
  Chip,
  HelperText,
  useTheme,
} from 'react-native-paper';
import { useServiceRequest } from '../hooks/useServiceRequest';

const AskQuestionScreen: React.FC = () => {
  const theme = useTheme();
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
            Ask a Question
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onPrimaryContainer, textAlign: 'center', marginTop: 8, opacity: 0.85 }}
          >
            Get a personalized answer from an expert astrologer within 24 hours.
          </Text>
          <Chip
            mode="flat"
            style={[styles.priceChip, { backgroundColor: theme.colors.secondary }]}
            textStyle={{ color: theme.colors.onSecondary, fontWeight: 'bold', fontSize: 16 }}
            accessibilityLabel="Price: 49 rupees"
          >
            ₹49
          </Chip>
        </Card.Content>
      </Card>

      {/* Question input */}
      <View style={styles.formSection}>
        <TextInput
          mode="outlined"
          label="Your question"
          placeholder="e.g. When is the right time for me to start a new business?"
          value={question}
          onChangeText={setQuestion}
          multiline
          numberOfLines={5}
          style={styles.textArea}
          theme={theme}
          accessibilityLabel="Enter your astrology question"
        />
        <HelperText type="info" visible>
          {question.length} characters · minimum 10 required
        </HelperText>

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isCreating}
          disabled={isCreating}
          style={styles.submitButton}
          contentStyle={styles.buttonContent}
          accessibilityLabel="Submit question"
        >
          Submit Question
        </Button>

        <Text
          variant="bodySmall"
          style={[styles.disclaimer, { color: theme.colors.onSurfaceVariant }]}
        >
          Payment will be collected upon confirmation. Our astrologers typically respond within 24 hours.
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
  textArea:     { minHeight: 120 },
  submitButton: { marginTop: 8 },
  buttonContent:{ paddingVertical: 6 },
  disclaimer:   { textAlign: 'center', marginTop: 12, lineHeight: 18 },
});

export default AskQuestionScreen;
