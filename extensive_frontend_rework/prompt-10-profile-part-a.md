# Prompt 10 — ProfileScreen MD3 Rewrite (Part A: Main View)

## Task

This is Part A of a two-part rewrite of `mobile/src/screens/ProfileScreen.tsx`. Part A rewrites the main scrollable view — profile header, birth details section, settings section, and logout button. Part B (prompt-11) rewrites the edit-details modal.

---

## Context

**Current file:** `mobile/src/screens/ProfileScreen.tsx`

**All preserved imports and logic:**
```tsx
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { kundliService } from '../services/kundli';
import { analytics } from '../services/analytics';
import { storage } from '../utils/storage';
import { dateHelpers } from '../utils/dateHelpers';
```

Preserve all state: `editVisible`, `datePickerVisible`, `timePickerVisible`, `notificationsEnabled`, `form`, and all handler functions: `handleNotificationsToggle`, `handleLanguageToggle`, `handleLogout`, `openEditModal`, `handleSave`.

The edit modal JSX and the `DatePickerModal` / `TimePickerModal` bottom-of-screen usage is handled in Part B.

---

## Required: Update imports

Replace all current imports with:

```tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import {
  Text,
  Card,
  Avatar,
  List,
  Switch,
  Button,
  Chip,
  Divider,
  useTheme,
  Portal,
  Modal,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { kundliService } from '../services/kundli';
import { analytics } from '../services/analytics';
import { storage } from '../utils/storage';
import { dateHelpers } from '../utils/dateHelpers';
import DatePickerModal from '../components/DatePickerModal';
import TimePickerModal from '../components/TimePickerModal';
```

Keep the `GENDERS`, `EditForm` interface, and all state/handler definitions exactly as they are in the current file.

Add `const theme = useTheme();` inside the component function (after existing hooks).

---

## Required: Replace the main `return (` statement

Replace the outer `return (` with the following. The edit `<Modal>` block at the end remains as-is (or as Part B will produce it), placed inside the `<Portal>`. The `DatePickerModal` and `TimePickerModal` usages at the very end remain unchanged.

```tsx
  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

        {/* Profile Header */}
        <Card
          mode="contained"
          style={[styles.headerCard, { backgroundColor: theme.colors.primaryContainer }]}
        >
          <Card.Content style={styles.headerContent}>
            <Avatar.Text
              size={72}
              label={initials}
              style={{ backgroundColor: theme.colors.primary }}
              labelStyle={{ color: theme.colors.onPrimary }}
              accessibilityLabel={`Avatar for ${displayName}`}
            />
            <Text
              variant="titleLarge"
              style={{ color: theme.colors.onPrimaryContainer, marginTop: 12, textAlign: 'center' }}
            >
              {displayName}
            </Text>
            {user?.email ? (
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onPrimaryContainer, opacity: 0.75, textAlign: 'center', marginTop: 4 }}
              >
                {user.email}
              </Text>
            ) : null}
            <Chip
              mode="flat"
              style={[styles.tierChip, { backgroundColor: theme.colors.secondaryContainer }]}
              textStyle={{ color: theme.colors.onSecondaryContainer }}
              icon="star-outline"
              accessibilityLabel="Free tier"
            >
              Free Tier
            </Chip>
          </Card.Content>
        </Card>

        {/* Birth Details */}
        <List.Subheader style={{ color: theme.colors.primary, marginTop: 8 }}>Birth Details</List.Subheader>
        <Card mode="outlined" style={styles.card}>
          <List.Item
            title={profile?.birth_date ?? 'Not set'}
            description="Date of Birth"
            left={props => <List.Icon {...props} icon="cake-variant-outline" color={theme.colors.primary} />}
            titleStyle={{ color: profile?.birth_date ? theme.colors.onSurface : theme.colors.onSurfaceVariant }}
          />
          <Divider />
          <List.Item
            title={profile?.birth_time ? dateHelpers.formatTimeAmPm(profile.birth_time) : 'Not set'}
            description="Time of Birth"
            left={props => <List.Icon {...props} icon="clock-outline" color={theme.colors.primary} />}
            titleStyle={{ color: profile?.birth_time ? theme.colors.onSurface : theme.colors.onSurfaceVariant }}
          />
          <Divider />
          <List.Item
            title={profile?.birth_place ?? 'Not set'}
            description="Place of Birth"
            left={props => <List.Icon {...props} icon="map-marker-outline" color={theme.colors.primary} />}
            titleStyle={{ color: profile?.birth_place ? theme.colors.onSurface : theme.colors.onSurfaceVariant }}
          />
          <Card.Actions>
            <Button
              mode="contained-tonal"
              icon="pencil-outline"
              onPress={openEditModal}
              accessibilityLabel="Edit birth details"
            >
              Edit Details
            </Button>
          </Card.Actions>
        </Card>

        {/* Settings */}
        <List.Subheader style={{ color: theme.colors.primary, marginTop: 8 }}>{t('profile.settings')}</List.Subheader>
        <Card mode="outlined" style={styles.card}>
          <List.Item
            title={t('profile.language')}
            description={i18n.language === 'hi' ? 'हिंदी' : 'English'}
            left={props => <List.Icon {...props} icon="translate" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant} />}
            onPress={handleLanguageToggle}
            accessibilityLabel="Toggle language"
          />
          <Divider />
          <List.Item
            title={t('profile.notifications')}
            left={props => <List.Icon {...props} icon="bell-outline" color={theme.colors.primary} />}
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                color={theme.colors.primary}
                accessibilityLabel="Toggle notifications"
              />
            )}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="lock-outline" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant} />}
            accessibilityLabel="Privacy Policy"
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document-outline" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={theme.colors.onSurfaceVariant} />}
            accessibilityLabel="Terms of Service"
          />
        </Card>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button
            mode="outlined"
            icon="logout"
            onPress={handleLogout}
            textColor={theme.colors.error}
            style={{ borderColor: theme.colors.error }}
            contentStyle={styles.buttonContent}
            accessibilityLabel="Sign out"
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>

      {/* Edit modal — Part B fills this in */}
      <Portal>
        {/* EDIT_MODAL_PLACEHOLDER */}
      </Portal>

      <DatePickerModal
        visible={datePickerVisible}
        value={form.birth_date}
        onConfirm={date => {
          setForm(f => ({ ...f, birth_date: date }));
          setDatePickerVisible(false);
        }}
        onCancel={() => setDatePickerVisible(false)}
      />
      <TimePickerModal
        visible={timePickerVisible}
        value={form.birth_time}
        onConfirm={time => {
          setForm(f => ({ ...f, birth_time: time }));
          setTimePickerVisible(false);
        }}
        onCancel={() => setTimePickerVisible(false)}
      />
    </>
  );
```

---

## Required StyleSheet (Part A)

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerCard: {
    margin: 16,
    marginBottom: 0,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  tierChip: {
    marginTop: 12,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  logoutSection: {
    margin: 16,
    marginBottom: 32,
  },
  buttonContent: {
    paddingVertical: 4,
  },
});
```

---

## Important Notes

- The `{/* EDIT_MODAL_PLACEHOLDER */}` comment is a placeholder — Part B (prompt-11) will replace it with the full edit modal.
- Keep `const { t, i18n } = useTranslation();` in the component function.
- Keep the `initials` and `displayName` derivation logic unchanged.
- Do **not** change `handleLogout`, `openEditModal`, `handleSave`, `handleLanguageToggle`, or `handleNotificationsToggle`.
