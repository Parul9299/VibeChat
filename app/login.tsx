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
  ActivityIndicator,
  ImageBackground,
  ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mail, Lock, CheckSquare, Send, MessageCircle } from 'lucide-react-native'; // Assuming lucide-react-native is installed

const API_BASE_URL = 'http://localhost:3000/api';

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const themeColor: string = '#8B5CF6';
  const themeColorLight: string = '#C4B5FD';

  const handleSignIn = async (): Promise<void> => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response data:', data.accessToken); // Debugging line

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      // Store token
      await AsyncStorage.setItem('userToken', JSON.stringify(data.accessToken));
      
      // Optionally store user data if returned
      if (data.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      }

      // Navigate to home route
      console.log('Login successful, redirecting to tabs...');
      router.replace('/');
      console.log('Redirecting to:', '/(tabs)/');
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCheckboxIconWrapperStyle = (): ViewStyle => ({
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: rememberMe ? themeColor : 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  });

  const getCheckboxContainerStyle = (): ViewStyle[] => [
    styles.checkboxContainer,
    rememberMe ? {
      backgroundColor: themeColorLight,
      borderColor: themeColor,
    } : {},
  ];

  const renderForm = () => (
    <ImageBackground
      source={{ uri: 'https://img.freepik.com/premium-vector/geometric-gradient-technology-background_23-2149110132.jpg' }}
      style={styles.gradientBackground}
      imageStyle={styles.backgroundImageStyle}
    >
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.formCard}>
            {/* Logo and App Name */}
            <View style={styles.logoContainer}>
              <MessageCircle size={80} color="white" />
              <Text style={styles.appName}>VibeChat</Text>
            </View>

            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>Enter your email and password</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Mail size={20} color={themeColor} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Lock size={20} color={themeColor} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                />
              </View>
            </View>

            <TouchableOpacity
              style={getCheckboxContainerStyle()}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={getCheckboxIconWrapperStyle()}>
                <CheckSquare size={20} color={rememberMe ? 'white' : '#ccc'} />
              </View>
              <Text style={styles.checkboxText}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: themeColor }]}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Send size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Sign In</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => router.push('/signup')}
            >
              <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );

  return renderForm();
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  backgroundImageStyle: {
    opacity: 0.5,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    padding: 10,
    borderRadius: 8,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  checkboxText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    flex: 1,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 10,
  },
  linkText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoginScreen;