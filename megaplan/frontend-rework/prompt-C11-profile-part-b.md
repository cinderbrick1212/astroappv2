# Prompt 11 — ProfileScreen MD3 Rewrite (Part B: Edit Details Modal)

## Task

This is Part B of the ProfileScreen rewrite. It must be run **after** Prompt 10 (Part A) has been applied.

Part B replaces the `{/* EDIT_MODAL_PLACEHOLDER */}` comment inside the `<Portal>` block with a full MD3 `Modal` containing the edit-birth-details form. It also extends the StyleSheet.

---

## Context

After Prompt 10, `ProfileScreen.tsx` contains:

```tsx
<Portal>
  {/* EDIT_MODAL_PLACEHOLDER */}
</Portal>
```

This prompt replaces that placeholder with the complete edit modal implementation.

**Existing state used in the modal (unchanged):**
- `editVisible` / `setEditVisible`
- `datePickerVisible` / `setDatePickerVisible`
- `timePickerVisible` / `setTimePickerVisible`
- `isUpdating` (from `useUserProfile`)
- `form` / `setForm` (type `EditForm`)
- `handleSave()`

**Existing types:**
```typescript
const GENDERS: Array<'male' | 'female' | 'other'> = ['male', 'female', 'other'];

interface EditForm {
  birth_date: string;
  birth_time: string;
  birth_place: string;
  timezone: string;
  gender: 'male' | 'female' | 'other';
}
```

---

## Required: Replace the `{/* EDIT_MODAL_PLACEHOLDER */}` with:

```tsx
<Modal
  visible={editVisible}
  onDismiss={() => setEditVisible(false)}
  contentContainerStyle={[
    styles.modalContainer,
    { backgroundColor: theme.colors.surface },
  ]}
>
  {/* Modal header */}
  <View style={[styles.modalHeader, { borderBottomColor: theme.colors.outlineVariant }]}>
    <Button
      mode="text"
      onPress={() => setEditVisible(false)}
      accessibilityLabel="Cancel edit"
    >
      Cancel
    </Button>
    <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
      Edit Birth Details
    </Text>
    <Button
      mode="text"
      onPress={handleSave}
      loading={isUpdating}
      disabled={isUpdating}
      accessibilityLabel="Save birth details"
    >
      Save
    </Button>
  </View>

  {/* Modal body */}
  <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
    {/* Date of birth */}
    <Text variant="labelLarge" style={[styles.formLabel, { color: theme.colors.onSurface }]}>
      Date of Birth
    </Text>
    <Button
      mode="outlined"
      icon="calendar"
      onPress={() => setDatePickerVisible(true)}
      style={styles.pickerButton}
      contentStyle={styles.pickerButtonContent}
      accessibilityLabel="Select date of birth"
    >
      {form.birth_date || 'Select date of birth'}
    </Button>

    {/* Time of birth */}
    <Text variant="labelLarge" style={[styles.formLabel, { color: theme.colors.onSurface }]}>
      Time of Birth
    </Text>
    <Button
      mode="outlined"
      icon="clock-outline"
      onPress={() => setTimePickerVisible(true)}
      style={styles.pickerButton}
      contentStyle={styles.pickerButtonContent}
      accessibilityLabel="Select time of birth"
    >
      {form.birth_time ? dateHelpers.formatTimeAmPm(form.birth_time) : 'Select time of birth'}
    </Button>

    {/* Place of birth */}
    <TextInput
      mode="outlined"
      label="Place of Birth"
      placeholder="City, Country"
      value={form.birth_place}
      onChangeText={v => setForm(f => ({ ...f, birth_place: v }))}
      style={styles.formInput}
      theme={theme}
      accessibilityLabel="Enter place of birth"
    />

    {/* Timezone */}
    <TextInput
      mode="outlined"
      label="Timezone"
      placeholder="e.g. Asia/Kolkata"
      value={form.timezone}
      onChangeText={v => setForm(f => ({ ...f, timezone: v }))}
      style={styles.formInput}
      theme={theme}
      accessibilityLabel="Enter timezone"
    />

    {/* Gender */}
    <Text variant="labelLarge" style={[styles.formLabel, { color: theme.colors.onSurface }]}>
      Gender
    </Text>
    <SegmentedButtons
      value={form.gender}
      onValueChange={v => setForm(f => ({ ...f, gender: v as EditForm['gender'] }))}
      buttons={GENDERS.map(g => ({
        value: g,
        label: g.charAt(0).toUpperCase() + g.slice(1),
        accessibilityLabel: g,
      }))}
      style={styles.genderButtons}
      theme={theme}
    />

    <View style={styles.modalBottomPad} />
  </ScrollView>
</Modal>
```

---

## Required: Add the following additional imports at the top of the file

The `TextInput` and `SegmentedButtons` components from `react-native-paper` were not in the Part A imports. Add them:

```tsx
// Add to the existing react-native-paper import block:
import {
  // ... existing imports from Part A ...
  TextInput,
  SegmentedButtons,
} from 'react-native-paper';

// Also add from react-native if not already there:
import { KeyboardAvoidingView, Platform } from 'react-native';
```

---

## Required: Extend the StyleSheet

Add these entries to the existing `StyleSheet.create({...})` from Part A:

```typescript
  modalContainer: {
    margin: 20,
    borderRadius: 16,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalBody: {
    padding: 16,
  },
  formLabel: {
    marginTop: 16,
    marginBottom: 8,
  },
  pickerButton: {
    marginBottom: 4,
  },
  pickerButtonContent: {
    justifyContent: 'flex-start',
    paddingVertical: 4,
  },
  formInput: {
    marginTop: 16,
    marginBottom: 4,
  },
  genderButtons: {
    marginBottom: 8,
  },
  modalBottomPad: {
    height: 32,
  },
```

---

## Validation

- "Edit Details" button on Part A opens the modal.
- Modal shows date/time picker buttons that open `DatePickerModal` / `TimePickerModal`.
- Timezone and place text inputs update `form` state.
- Gender `SegmentedButtons` updates `form.gender`.
- "Save" button calls `handleSave()` and shows loading state while `isUpdating`.
- "Cancel" dismisses the modal.
- No hardcoded colors in the modal.
