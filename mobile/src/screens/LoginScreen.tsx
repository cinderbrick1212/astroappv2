import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { validation } from '../utils/validation';

type AuthMode = 'login' | 'register';

const LoginScreen: React.FC = () => {
  const { login, loginAsGuest } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
  };

  const validateInputs = (): boolean => {
    let valid = true;
    clearErrors();
    if (!validation.isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }
    if (!validation.isValidPassword(password)) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }
    return valid;
  };

  const handleEmailAuth = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      if (authMode === 'login') {
        const response = await api.post('/auth/local', {
          identifier: email,
          password,
        });
        await login(response.data.jwt, response.data.user);
      } else {
        const response = await api.post('/auth/local/register', {
          username: displayName.trim() || email.split('@')[0],
          email,
          password,
        });
        await login(response.data.jwt, response.data.user);
      }
    } catch (error: any) {
      const msg =
        error?.response?.data?.error?.message ||
        error?.message ||
        'Authentication failed. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!validation.isValidEmail(email)) {
      Alert.alert('Enter Email', 'Please enter your email address above, then tap Forgot Password.');
      return;
    }
    Alert.alert(
      'Reset Password',
      `Send a password reset email to ${email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              await api.post('/auth/forgot-password', { email });
              Alert.alert('Email Sent', 'Check your inbox for the password reset link.');
            } catch (error: any) {
              Alert.alert('Error', error?.response?.data?.error?.message || 'Could not send reset email.');
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Logo + Tagline */}
        <View style={styles.logoSection}>
          <Text style={styles.logo}>🌟</Text>
          <Text style={styles.appName}>AstroApp</Text>
          <Text style={styles.tagline}>Your daily cosmic guide</Text>
        </View>

        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeButton, authMode === 'login' && styles.modeButtonActive]}
            onPress={() => { setAuthMode('login'); clearErrors(); }}
          >
            <Text style={[styles.modeButtonText, authMode === 'login' && styles.modeButtonTextActive]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, authMode === 'register' && styles.modeButtonActive]}
            onPress={() => { setAuthMode('register'); clearErrors(); }}
          >
            <Text style={[styles.modeButtonText, authMode === 'register' && styles.modeButtonTextActive]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {/* Display name – register only */}
        {authMode === 'register' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Display Name (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={colors.textTertiary}
              value={displayName}
              onChangeText={setDisplayName}
              autoComplete="name"
            />
          </View>
        )}

        {/* Email input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Enter your email"
            placeholderTextColor={colors.textTertiary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        {/* Password input */}
        <View style={styles.inputGroup}>
          <View style={styles.passwordLabelRow}>
            <Text style={styles.label}>Password</Text>
            {authMode === 'login' && (
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordLink}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="Enter your password"
            placeholderTextColor={colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        {/* Primary action button */}
        <TouchableOpacity
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleEmailAuth}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Guest login button */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={loginAsGuest}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logo: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceVariant,
    borderRadius: 8,
    padding: 4,
    marginBottom: spacing.lg,
  },
  modeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
  },
  modeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  modeButtonTextActive: {
    color: colors.textOnPrimary,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  forgotPasswordLink: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  input: {
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
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textSecondary,
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordStandalone: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LoginScreen;
