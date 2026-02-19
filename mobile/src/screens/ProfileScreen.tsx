import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { useAuth } from '../hooks/useAuth';

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();

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
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

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
          {[
            { label: 'Date of Birth', value: 'Not set', icon: '🎂' },
            { label: 'Time of Birth', value: 'Not set', icon: '🕐' },
            { label: 'Place of Birth', value: 'Not set', icon: '📍' },
          ].map(detail => (
            <View key={detail.label} style={styles.detailRow}>
              <Text style={styles.detailIcon}>{detail.icon}</Text>
              <View style={styles.detailInfo}>
                <Text style={styles.detailLabel}>{detail.label}</Text>
                <Text style={styles.detailValue}>{detail.value}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.editButton}>
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
    color: colors.textSecondary,
    fontStyle: 'italic',
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
});

export default ProfileScreen;
