# Prompt 05 — OnboardingScreen MD3 Rewrite (Part B: Steps 3–4 + Outer Shell)

## Task

This is Part B of the OnboardingScreen rewrite. It must be run **after** Prompt 04 (Part A) has already been applied. Part B replaces:

1. `renderStep()` cases 3 and 4.
2. The outer `return (...)` JSX — the `KeyboardAvoidingView`, progress bar, scroll view, footer buttons.
3. Extends the StyleSheet with the additional styles needed.

---

## Context

After Prompt 04 is applied, `OnboardingScreen.tsx` already has:
- Updated imports (Paper components, no raw RN buttons)
- `const theme = useTheme();` inside the component
- Cases 0, 1, 2 rewritten
- Cases 3 and 4 still using the old code
- The outer return statement still using old code

This prompt completes the file.

---

## Required: Replace `renderStep()` cases 3 and 4

### Case 3 — Place of birth

```tsx
case 3:
  return (
    <View style={styles.stepContainer}>
      <Text variant="headlineMedium" style={[styles.centeredText, { color: theme.colors.onBackground }]}>
        Place of Birth
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.centeredText, { color: theme.colors.onSurfaceVariant, marginBottom: 24 }]}
      >
        Select a city or type your birth place
      </Text>
      <TextInput
        mode="outlined"
        label="City name"
        value={data.birth_place}
        onChangeText={v => setData(d => ({ ...d, birth_place: v }))}
        style={styles.inputFull}
        theme={theme}
        accessibilityLabel="Enter birth place city"
      />
      <Text
        variant="labelLarge"
        style={[{ color: theme.colors.onSurfaceVariant, marginTop: 20, marginBottom: 12, alignSelf: 'flex-start' }]}
      >
        Popular Cities
      </Text>
      <View style={styles.cityGrid}>
        {COMMON_CITIES.map(city => (
          <Chip
            key={city.name}
            mode={data.birth_place === city.name ? 'flat' : 'outlined'}
            selected={data.birth_place === city.name}
            onPress={() => selectCity(city)}
            style={styles.cityChip}
            accessibilityLabel={`Select ${city.name}`}
            theme={theme}
          >
            {city.name}
          </Chip>
        ))}
      </View>
    </View>
  );
```

### Case 4 — Summary / All set

```tsx
case 4:
  return (
    <View style={styles.stepContainer}>
      <Text variant="headlineMedium" style={[styles.centeredText, { color: theme.colors.primary }]}>
        All Set!
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.centeredText, { color: theme.colors.onSurfaceVariant, marginBottom: 24 }]}
      >
        Here's a summary of your details
      </Text>
      <Card mode="outlined" style={[styles.inputFull, { borderColor: theme.colors.outlineVariant }]}>
        <Card.Content>
          {[
            { label: 'Name',          value: data.name,                                                    icon: 'account-outline' },
            { label: 'Date of Birth', value: data.birth_date,                                              icon: 'calendar-outline' },
            { label: 'Time of Birth', value: dateHelpers.formatTimeAmPm(data.birth_time),                  icon: 'clock-outline' },
            { label: 'Place of Birth',value: data.birth_place,                                             icon: 'map-marker-outline' },
            { label: 'Gender',        value: data.gender.charAt(0).toUpperCase() + data.gender.slice(1),   icon: 'gender-male-female' },
          ].map((item, i, arr) => (
            <List.Item
              key={item.label}
              title={item.value}
              description={item.label}
              left={props => <List.Icon {...props} icon={item.icon} color={theme.colors.primary} />}
              style={i < arr.length - 1 ? { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.colors.outlineVariant } : undefined}
            />
          ))}
        </Card.Content>
      </Card>
    </View>
  );
```

---

## Required: Replace the outer return statement

Replace the entire `return (` block of the component with:

```tsx
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* MD3 ProgressBar */}
      <ProgressBar
        progress={step / LAST_STEP}
        color={theme.colors.primary}
        style={{ height: 4 }}
        theme={theme}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
        {error ? (
          <Text
            variant="bodySmall"
            style={[styles.centeredText, { color: theme.colors.error, marginTop: 8 }]}
          >
            {error}
          </Text>
        ) : null}
      </ScrollView>

      {/* Footer navigation */}
      <View style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant }]}>
        {step > 0 && step <= LAST_STEP ? (
          <Button
            mode="text"
            onPress={back}
            accessibilityLabel="Go back"
          >
            Back
          </Button>
        ) : (
          <View />
        )}
        {step < LAST_STEP ? (
          <Button
            mode="contained"
            onPress={next}
            accessibilityLabel={step === 0 ? "Let's begin" : 'Next step'}
          >
            {step === 0 ? "Let's Begin" : 'Next'}
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={finish}
            buttonColor={theme.colors.secondary}
            textColor={theme.colors.onSecondary}
            accessibilityLabel="Start exploring the app"
          >
            Start Exploring ✦
          </Button>
        )}
      </View>

      <DatePickerModal
        visible={datePickerVisible}
        value={data.birth_date}
        onConfirm={date => {
          setData(d => ({ ...d, birth_date: date }));
          setDatePickerVisible(false);
          setError('');
        }}
        onCancel={() => setDatePickerVisible(false)}
      />
      <TimePickerModal
        visible={timePickerVisible}
        value={data.birth_time}
        onConfirm={time => {
          setData(d => ({ ...d, birth_time: time }));
          setTimePickerVisible(false);
          setError('');
        }}
        onCancel={() => setTimePickerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
```

---

## Required: Extend the StyleSheet

Add the following additional entries to the existing `StyleSheet.create({...})` object created in Part A (merge them into the same object):

```typescript
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  cityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: '100%',
    maxWidth: 400,
  },
  cityChip: {
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
```

---

## Validation

- All 5 onboarding steps render without error.
- `ProgressBar` advances from 0% to 100% as steps progress.
- City selection with `Chip` updates `data.birth_place` correctly.
- Summary card on step 4 displays all collected data.
- "Let's Begin" / "Next" / "Start Exploring" buttons work.
- `DatePickerModal` and `TimePickerModal` still open on the respective buttons.
- No hardcoded colors.
