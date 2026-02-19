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
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';

interface BirthDetailsForm {
  birth_date: string;
  birth_time: string;
  birth_place: string;
  gender: 'male' | 'female' | 'other' | undefined;
}

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, isLoading, updateProfile, isUpdating } = useUserProfile();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form, setForm] = useState<BirthDetailsForm>({
    birth_date: '',
    birth_time: '',
    birth_place: '',
    gender: undefined,
  });
  const [formErrors, setFormErrors] = useState<Partial<BirthDetailsForm>>({});

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        birth_date: profile.birth_date ?? '',
        birth_time: profile.birth_time ?? '',
        birth_place: profile.birth_place ?? '',
        gender: profile.gender ?? undefined,
      });
    }
  }, [profile]);

  const displayName =
    user?.displayName ||
    (user?.isAnonymous ? 'Guest User' : user?.email?.split('@')[0] || 'User');
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

  const validateForm = (): boolean => {
    const errors: Partial<BirthDetailsForm> = {};
    if (form.birth_date && !/^\d{4}-\d{2}-\d{2}$/.test(form.birth_date)) {
      errors.birth_date = 'Format: YYYY-MM-DD';
    }
    if (form.birth_time && !/^\d{2}:\d{2}$/.test(form.birth_time)) {
      errors.birth_time = 'Format: HH:MM (24-hr)';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const payload: Partial<import('../types').UserProfile> = {};
    if (form.birth_date)  payload.birth_date  = form.birth_date;
    if (form.birth_time)  payload.birth_time  = form.birth_time;
    if (form.birth_place) payload.birth_place = form.birth_place;
    if (form.gender)      payload.gender      = form.gender;

    updateProfile(payload, {
      onSuccess: () => {
        setEditModalVisible(false);
        Alert.alert('Saved', 'Birth details updated successfully.');
      },
      onError: () => {
        Alert.alert('Error', 'Could not save birth details. Please try again.');
      },
    });
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
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.displayName}>{displayName}</Text>
        {user?.email && <Text style={styles.contactInfo}>{user.email}</Text>}
        {user?.phoneNumber && (
          <Text style={styles.contactInfo}>{user.phoneNumber}</Text>
        )}
        {user?.isAnonymous && (
          <View style={styles.guestBadge}>
            <Text style={styles.guestBadgeText}>Guest</Text>
          </View>
        )}
      </View>

      {/* Birth Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Birth Details</Text>
        <View style={styles.card}>
          {isLoading ? (
            <ActivityIndicator
              style={styles.loadingIndicator}
              color={colors.primary}
            />
          ) : (
            birthDetails.map(detail => (
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
            ))
          )}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={styles.editButtonText}>Edit Birth Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          {[
            { label: 'Language', value: 'English', icon: '🌐' },
            { label: 'Notifications', value: 'On', icon: '🔔' },
            { label: 'Privacy Policy', value: '', icon: '🔒' },
            { label: 'Terms of Service', value: '', icon: '📄' },
          ].map(item => (
            <TouchableOpacity key={item.label} style={styles.settingRow}>
              <Text style={styles.settingIcon}>{item.icon}</Text>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <View style={styles.settingRight}>
                {item.value ? (
                  <Text style={styles.settingValue}>{item.value}</Text>
                ) : null}
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

      {/* Edit Birth Details Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <ScrollView style={styles.modalContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Birth Details</Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Date of Birth */}
          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>Date of Birth</Text>
            <TextInput
              style={[styles.modalInput, formErrors.birth_date ? styles.inputError : null]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textTertiary}
              value={form.birth_date}
              onChangeText={v => setForm(f => ({ ...f, birth_date: v }))}
              keyboardType="numbers-and-punctuation"
            />
            {formErrors.birth_date ? (
              <Text style={styles.errorText}>{formErrors.birth_date}</Text>
            ) : null}
          </View>

          {/* Time of Birth */}
          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>Time of Birth (24-hr)</Text>
            <TextInput
              style={[styles.modalInput, formErrors.birth_time ? styles.inputError : null]}
              placeholder="HH:MM  e.g. 14:30"
              placeholderTextColor={colors.textTertiary}
              value={form.birth_time}
              onChangeText={v => setForm(f => ({ ...f, birth_time: v }))}
              keyboardType="numbers-and-punctuation"
            />
            {formErrors.birth_time ? (
              <Text style={styles.errorText}>{formErrors.birth_time}</Text>
            ) : null}
          </View>

          {/* Place of Birth */}
          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>Place of Birth</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="City, Country  e.g. Mumbai, India"
              placeholderTextColor={colors.textTertiary}
              value={form.birth_place}
              onChangeText={v => setForm(f => ({ ...f, birth_place: v }))}
            />
          </View>

          {/* Gender */}
          <View style={styles.modalField}>
            <Text style={styles.modalLabel}>Gender</Text>
            <View style={styles.genderRow}>
              {(['male', 'female', 'other'] as const).map(g => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderOption,
                    form.gender === g && styles.genderOptionActive,
                  ]}
                  onPress={() => setForm(f => ({ ...f, gender: g }))}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      form.gender === g && styles.genderOptionTextActive,
                    ]}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save */}
          <TouchableOpacity
            style={[styles.saveButton, isUpdating && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isUpdating}
          >
            <Text style={styles.saveButtonText}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </ScrollView>
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
  loadingIndicator: {
    marginVertical: spacing.lg,
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
    fontWeight: '500',
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
    padding: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalClose: {
    fontSize: 20,
    color: colors.textSecondary,
    padding: spacing.xs,
  },
  modalField: {
    marginBottom: spacing.lg,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  modalInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
  genderRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  genderOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderOptionText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  genderOptionTextActive: {
    color: colors.textOnPrimary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
