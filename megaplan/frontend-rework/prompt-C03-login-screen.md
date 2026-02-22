# Prompt 03 — LoginScreen MD3 Rewrite

## Task

Completely rewrite `mobile/src/screens/LoginScreen.tsx` using Material Design 3 components from `react-native-paper`. All existing authentication logic, error handling, and navigation must be preserved exactly. Only the UI layer changes.

---

## Context

**Current file:** `mobile/src/screens/LoginScreen.tsx`

The current screen uses `TouchableOpacity`, raw `TextInput`, custom `StyleSheet` colors, and manual toggle buttons for Login/Register mode switching. It handles:

- Login/Register mode toggle (email-based auth only; no phone/Google in current implementation)
- Email + password inputs with inline validation errors
- Optional display name input on register
- "Forgot password" flow (calls `api.post('/auth/forgot-password', { email })`)
- "Continue as Guest" (calls `loginAsGuest()`)
- Loading state on submit button

**Hooks/APIs used (keep all of these):**
```tsx
import { useAuth } from '../hooks/useAuth';   // provides: login, loginAsGuest
import api from '../api';
import { validation } from '../utils/validation';
```

---

## Required MD3 Implementation

Replace the entire file with the following implementation. Do **not** change the logic inside `handleEmailAuth`, `handleForgotPassword`, or the `validateInputs` function — only the JSX and StyleSheet change.

**MD3 components to use:**
- `SegmentedButtons` — for Login/Register mode toggle
- `TextInput` (mode="outlined") — for email, password, display name inputs
- `HelperText` — for inline field validation errors
- `Button` (mode="contained") — primary action button
- `Button` (mode="outlined") — "Continue as Guest"
- `Divider` — between primary and secondary actions
- `ActivityIndicator` — shown inside or next to button while loading
- `Text` from `react-native-paper` — for all text elements
- `useTheme()` — for all colors; zero hardcoded hex values

**Required complete rewrite:**

```tsx
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  SegmentedButtons,
  HelperText,
  Divider,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import { validation } from '../utils/validation';

type AuthMode = 'login' | 'register';

const LoginScreen: React.FC = () => {
  const theme = useTheme();
  const { login, loginAsGuest } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

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
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo + Tagline */}
        <View style={styles.logoSection}>
          <Text variant="displaySmall" style={{ color: theme.colors.primary, textAlign: 'center' }}>
            ✦ AstroApp
          </Text>
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 8 }}
          >
            Your daily cosmic guide
          </Text>
        </View>

        {/* Mode toggle */}
        <SegmentedButtons
          value={authMode}
          onValueChange={v => { setAuthMode(v as AuthMode); clearErrors(); }}
          buttons={[
            { value: 'login', label: 'Sign In' },
            { value: 'register', label: 'Register' },
          ]}
          style={styles.segmented}
        />

        {/* Display name — register only */}
        {authMode === 'register' && (
          <TextInput
            mode="outlined"
            label="Display name (optional)"
            value={displayName}
            onChangeText={setDisplayName}
            autoComplete="name"
            style={styles.input}
            theme={theme}
          />
        )}

        {/* Email */}
        <TextInput
          mode="outlined"
          label="Email address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          error={!!emailError}
          style={styles.input}
          theme={theme}
        />
        <HelperText type="error" visible={!!emailError} style={styles.helperText}>
          {emailError}
        </HelperText>

        {/* Password */}
        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
          error={!!passwordError}
          right={
            <TextInput.Icon
              icon={passwordVisible ? 'eye-off' : 'eye'}
              onPress={() => setPasswordVisible(v => !v)}
              accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
            />
          }
          style={styles.input}
          theme={theme}
        />
        <HelperText type="error" visible={!!passwordError} style={styles.helperText}>
          {passwordError}
        </HelperText>

        {/* Forgot password */}
        {authMode === 'login' && (
          <Button
            mode="text"
            onPress={handleForgotPassword}
            style={styles.forgotButton}
            accessibilityLabel="Forgot password"
          >
            Forgot password?
          </Button>
        )}

        {/* Primary action */}
        <Button
          mode="contained"
          onPress={handleEmailAuth}
          disabled={loading}
          loading={loading}
          style={styles.primaryButton}
          contentStyle={styles.buttonContent}
          accessibilityLabel={authMode === 'login' ? 'Sign in' : 'Create account'}
        >
          {authMode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <Divider style={styles.dividerLine} />
          <Text
            variant="bodySmall"
            style={[styles.dividerLabel, { color: theme.colors.onSurfaceVariant }]}
          >
            or
          </Text>
          <Divider style={styles.dividerLine} />
        </View>

        {/* Guest */}
        <Button
          mode="outlined"
          onPress={loginAsGuest}
          disabled={loading}
          style={styles.guestButton}
          contentStyle={styles.buttonContent}
          accessibilityLabel="Continue as guest"
        >
          Continue as Guest
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  segmented: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 4,
  },
  helperText: {
    marginBottom: 4,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  primaryButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
  },
  dividerLabel: {
    marginHorizontal: 12,
  },
  guestButton: {
    marginBottom: 8,
  },
});

export default LoginScreen;
```

---

## Validation

- Login and Register modes toggle correctly via `SegmentedButtons`.
- Validation errors appear under the relevant `TextInput` via `HelperText`.
- Password visibility toggle works via the eye icon in `TextInput.Icon`.
- Loading state disables both buttons and shows the built-in Paper `loading` spinner.
- "Forgot password" alert fires correctly.
- "Continue as Guest" works.
- No hardcoded color hex values anywhere in the file.
