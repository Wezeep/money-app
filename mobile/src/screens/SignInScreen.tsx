import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Surface,
  Chip,
} from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { theme, gradients } from '../theme';

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

interface Props {
  navigation: SignInScreenNavigationProp;
}

const { width } = Dimensions.get('window');

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleSignIn = (): void => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigation.replace('MainTabs');
    }, 2000);
  };

  const handleSocialSignIn = (provider: string): void => {
    Alert.alert('Social Sign In', `${provider} sign in coming soon!`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients.background}
        style={styles.backgroundGradient}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <LinearGradient
            colors={gradients.primary}
            style={styles.logoContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons
              name="finance"
              size={60}
              color={theme.colors.onPrimary}
            />
          </LinearGradient>
          <Text style={styles.appName}>FinFlow</Text>
          <Text style={styles.tagline}>Your Money, Your Flow</Text>
        </View>

        {/* Social Sign In */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Continue with</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={() => handleSocialSignIn('Google')}
            >
              <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.appleButton]}
              onPress={() => handleSocialSignIn('Apple')}
            >
              <MaterialCommunityIcons name="apple" size={24} color="#000000" />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.facebookButton]}
              onPress={() => handleSocialSignIn('Facebook')}
            >
              <MaterialCommunityIcons name="facebook" size={24} color="#4267B2" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with email</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Sign In Form */}
        <Surface style={styles.formCard} elevation={4}>
          <Text style={styles.welcomeTitle}>Welcome Back</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to your account</Text>

          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={styles.input}
            theme={{
              colors: {
                primary: theme.colors.primary,
                outline: theme.colors.outline,
              },
            }}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
            autoComplete="password"
            style={styles.input}
            theme={{
              colors: {
                primary: theme.colors.primary,
                outline: theme.colors.outline,
              },
            }}
          />

          <View style={styles.formOptions}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <MaterialCommunityIcons
                name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={20}
                color={rememberMe ? theme.colors.primary : theme.colors.onSurfaceVariant}
              />
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={handleSignIn}
            loading={loading}
            style={styles.signInButton}
            contentStyle={styles.signInButtonContent}
            labelStyle={styles.signInButtonLabel}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Surface>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signUpText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '400',
  },
  socialSection: {
    marginBottom: 30,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: (width - 48 - 16) / 3,
  },
  googleButton: {
    backgroundColor: '#ffffff',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  socialButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  formOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    color: theme.colors.onSurface,
    marginLeft: 8,
  },
  forgotPassword: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  signInButton: {
    borderRadius: 12,
    elevation: 0,
  },
  signInButtonContent: {
    paddingVertical: 8,
  },
  signInButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
  },
  signUpText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default SignInScreen;