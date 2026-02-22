import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { kundliService } from '../services/kundli';
import { analytics } from '../services/analytics';
import { storage } from '../utils/storage';
import DatePickerModal from '../components/DatePickerModal';
import TimePickerModal from '../components/TimePickerModal';

const GENDERS: Array<'male' | 'female' | 'other'> = ['male', 'female', 'other'];

interface EditForm {
  birth_date: string;
  birth_time: string;
  birth_place: string;
  timezone: string;
  gender: 'male' | 'female' | 'other';
}

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, isLoading, updateProfile, isUpdating } = useUserProfile();
  const { t, i18n } = useTranslation();
  const [editVisible, setEditVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [form, setForm] = useState<EditForm>({
    birth_date: '',
    birth_time: '',
    birth_place: '',
    timezone: 'Asia/Kolkata',
    gender: 'other',
  });

  // Load persisted notification preference
  useEffect(() => {
    storage.get<boolean>(storage.keys.NOTIFICATIONS_ENABLED).then(val => {
      // Guard against non-boolean values from storage to prevent
      // native "String cannot be cast to Boolean" crash on the Switch component
      if (typeof val === 'boolean') setNotificationsEnabled(val);
    });
  }, []);

  const handleNotificationsToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await storage.set(storage.keys.NOTIFICATIONS_ENABLED, value);
  };

  const handleLanguageToggle = async () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    await i18n.changeLanguage(newLang);
    await storage.set(storage.keys.LANGUAGE_PREFERENCE, newLang);
    analytics.languageChanged(newLang);
  };

  const displayName =
    user?.username ||
    user?.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const openEditModal = () => {
    setForm({
      birth_date: profile?.birth_date ?? '',
      birth_time: profile?.birth_time ?? '',
      birth_place: profile?.birth_place ?? '',
      timezone: profile?.timezone ?? 'Asia/Kolkata',
      gender: profile?.gender ?? 'other',
    });
    setEditVisible(true);
  };

  const handleSave = () => {
    if (!form.birth_date) {
      Alert.alert('Missing field', 'Please select your date of birth.');
      return;
    }
    updateProfile(
      {
        birth_date: form.birth_date,
        birth_time: form.birth_time || '06:00',
        birth_place: form.birth_place,
        timezone: form.timezone,
        gender: form.gender,
      },
      {
        onSuccess: async () => {
          await kundliService.clearCache();
          analytics.birthDetailsUpdated();
          setEditVisible(false);
          Alert.alert('Saved', 'Birth details updated successfully.');
        },
        onError: () => {
          Alert.alert('Error', 'Could not save birth details. Please try again.');
        },
      }
    );
  };

  const birthDetails = [
    {
      label: 'Date of Birth',
      value: profile?.birth_date ?? 'Not set',
      icon: '🎂',
    },
    {
      label: 'Time of Birth',
      value: profile?.birth_time ?? 'Not set',
      icon: '🕐',
    },
    {
      label: 'Place of Birth',
      value: profile?.birth_place ?? 'Not set',
      icon: '📍',
    },
  ];

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          {user?.email ? <Text style={styles.contactInfo}>{user.email}</Text> : null}
        </View>

        {/* Birth Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Birth Details</Text>
          <View style={styles.card}>
            {birthDetails.map(detail => (
              <View key={detail.label} style={styles.detailRow}>
                <Text style={styles.detailIcon}>{detail.icon}</Text>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>{detail.label}</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      detail.value === 'Not set' && styles.detailValueEmpty,
                    ]}
                  >
                    {detail.value}
                  </Text>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
              <Text style={styles.editButtonText}>Edit Birth Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
          <View style={styles.card}>
            {/* Language toggle */}
            <TouchableOpacity style={styles.settingRow} onPress={handleLanguageToggle}>
              <Text style={styles.settingIcon}>🌐</Text>
              <Text style={styles.settingLabel}>{t('profile.language')}</Text>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>
                  {i18n.language === 'hi' ? 'हिंदी' : 'English'}
                </Text>
                <Text style={styles.settingArrow}>›</Text>
              </View>
            </TouchableOpacity>

            {/* Notifications toggle */}
            <View style={[styles.settingRow, { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingLabel}>{t('profile.notifications')}</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationsToggle}
                trackColor={{ false: colors.disabled, true: colors.primaryLight }}
                thumbColor={notificationsEnabled ? colors.primary : colors.surface}
              />
            </View>

            {[
              { label: 'Privacy Policy', value: '', icon: '🔒' },
              { label: 'Terms of Service', value: '', icon: '📄' },
            ].map((item, idx, arr) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.settingRow,
                  idx === arr.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <Text style={styles.settingIcon}>{item.icon}</Text>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <View style={styles.settingRight}>
                  <Text style={styles.settingArrow}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Birth Details Modal */}
      <Modal
        visible={editVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Birth Details</Text>
            <TouchableOpacity onPress={handleSave} disabled={isUpdating}>
              <Text style={[styles.modalSave, isUpdating && { opacity: 0.5 }]}>
                {isUpdating ? 'Saving…' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Date of Birth</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setDatePickerVisible(true)}
              >
                <Text style={styles.pickerButtonIcon}>🗓️</Text>
                <Text
                  style={[
                    styles.pickerButtonText,
                    !form.birth_date && styles.pickerButtonPlaceholder,
                  ]}
                >
                  {form.birth_date || 'Select date of birth'}
                </Text>
                <Text style={styles.pickerButtonArrow}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Time of Birth</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setTimePickerVisible(true)}
              >
                <Text style={styles.pickerButtonIcon}>🕐</Text>
                <Text
                  style={[
                    styles.pickerButtonText,
                    !form.birth_time && styles.pickerButtonPlaceholder,
                  ]}
                >
                  {form.birth_time || 'Select time of birth'}
                </Text>
                <Text style={styles.pickerButtonArrow}>›</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Place of Birth</Text>
              <TextInput
                style={styles.formInput}
                placeholder="City, Country"
                placeholderTextColor={colors.textTertiary}
                value={form.birth_place}
                onChangeText={v => setForm(f => ({ ...f, birth_place: v }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Timezone</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Asia/Kolkata"
                placeholderTextColor={colors.textTertiary}
                value={form.timezone}
                onChangeText={v => setForm(f => ({ ...f, timezone: v }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {GENDERS.map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderPill,
                      form.gender === g && styles.genderPillActive,
                    ]}
                    onPress={() => setForm(f => ({ ...f, gender: g }))}
                  >
                    <Text
                      style={[
                        styles.genderPillText,
                        form.gender === g && styles.genderPillTextActive,
                      ]}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.textOnPrimary,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
  },
  displayName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
  },
  contactInfo: {
    fontSize: 14,
    color: colors.textOnPrimary,
    opacity: 0.8,
  },
  guestBadge: {
    marginTop: spacing.sm,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  guestBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textOnPrimary,
  },
  section: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  detailIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  detailValueEmpty: {
    color: colors.textSecondary,
    fontStyle: 'italic',
    fontWeight: 'normal',
  },
  editButton: {
    margin: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.textOnPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: spacing.xs,
  },
  settingArrow: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoutButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  modalCancel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  modalBody: {
    padding: spacing.md,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  formInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  pickerButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerButtonIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  pickerButtonPlaceholder: {
    color: colors.textTertiary,
  },
  pickerButtonArrow: {
    fontSize: 20,
    color: colors.textTertiary,
  },
  genderRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderPill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  genderPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderPillText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  genderPillTextActive: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
});

export default ProfileScreen;
