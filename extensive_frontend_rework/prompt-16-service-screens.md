# Prompt 16 — Service Screens MD3 Rewrite (AskQuestion + BookCall + RequestReport)

## Task

Rewrite three service-request screens using Material Design 3 Paper components:

1. `mobile/src/screens/AskQuestionScreen.tsx`
2. `mobile/src/screens/BookCallScreen.tsx`
3. `mobile/src/screens/RequestReportScreen.tsx`

All existing logic — service request creation, validation, `useServiceRequest` hook — must be preserved exactly.

---

## File 1: AskQuestionScreen

**File:** `mobile/src/screens/AskQuestionScreen.tsx`

**Preserved logic:**
```tsx
import { useServiceRequest } from '../hooks/useServiceRequest';
// question state, handleSubmit with min 10 char validation
```

### Required Implementation

Replace `AskQuestionScreen.tsx` completely with:

```tsx
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
```

---

## File 2: BookCallScreen

**File:** `mobile/src/screens/BookCallScreen.tsx`

**Preserved logic:**
```tsx
import { useServiceRequest } from '../hooks/useServiceRequest';
// preferred date/time notes, handleSubmit
```

### Required Implementation

Replace `BookCallScreen.tsx` completely with:

```tsx
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
```

---

## File 3: RequestReportScreen

**File:** `mobile/src/screens/RequestReportScreen.tsx`

**Preserved logic:**
```tsx
import { useServiceRequest } from '../hooks/useServiceRequest';
// report type selection, user notes, handleSubmit
```

### Required Implementation

Replace `RequestReportScreen.tsx` completely with:

```tsx
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
        user_notes: `Report type: ${reportType}. ${notes.trim()}`,
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
          accessibilityLabel="Select report type"
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
```

---

## Validation

- All three screens render hero cards with `primaryContainer` background.
- Price chips use `secondary` color.
- Submit buttons show loading state while `isCreating`.
- `RequestReportScreen` uses `SegmentedButtons` for report type selection.
- All success/error alerts fire correctly.
- No hardcoded colors in any of the three files.
