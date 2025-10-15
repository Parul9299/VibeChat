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
import { Mail, Phone, User, Lock, CheckSquare, Send, MessageCircle } from 'lucide-react-native'; // Assuming lucide-react-native is installed

const SignUpScreen: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const themeColor: string = '#8B5CF6';
  const themeColorLight: string = '#C4B5FD';
  const otpValidityMinutes = 5; // OTP valid for 5 minutes

  const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const validateForm = (): boolean => {
    if (!fullName || !email || !contact || !password || !confirmPassword) {
      setError('Please fill all fields');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }
    if (contact.length !== 10) {
      setError('Please enter a valid 10-digit contact number');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Mock delay for frontend simulation (no backend call)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newOtp = generateOtp();
      console.log(`Generated OTP for ${email}: ${newOtp} (valid for ${otpValidityMinutes} minutes)`);
      setGeneratedOtp(newOtp);
      setOtp('');
      setStep('otp');
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
      console.error('Send OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateOtp = (): boolean => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return false;
    }
    if (otp !== generatedOtp) {
      setError('Invalid OTP. Please try again.');
      return false;
    }
    setError('');
    return true;
  };

  const handleVerify = async (): Promise<void> => {
    if (!validateOtp()) return;

    setLoading(true);
    setError('');

    try {
      // Mock delay for frontend simulation (no backend call)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store user data including password for mock login verification
      const userData = { fullName, email, contact, password };
      await AsyncStorage.setItem('registeredUser', JSON.stringify(userData));

      // Redirect to login page
      router.push('/login');
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error('Verify OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = (): void => {
    setStep('form');
    // When going back to form, it will regenerate on next submit
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

            <Text style={styles.subtitle}>Create account to start chatting</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <User size={20} color={themeColor} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            </View>

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
                <Phone size={20} color={themeColor} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contact Number"
                  value={contact}
                  onChangeText={setContact}
                  keyboardType="phone-pad"
                  maxLength={10}
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

            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Lock size={20} color={themeColor} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
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
              <Text style={styles.checkboxText}>Agree to Terms & Conditions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: themeColor }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Send size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Send Verification Code</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.linkText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );

  const renderOtp = () => (
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
            {/* Logo and App Name for OTP step */}
            <View style={styles.logoContainer}>
              <MessageCircle size={80} color="white" />
              <Text style={styles.appName}>VibeChat</Text>
            </View>

            <Text style={styles.title}>Verify Email</Text>
            <Text style={styles.subtitle}>Enter the 6-digit code sent to {email} (valid for {otpValidityMinutes} minutes)</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <Lock size={20} color={themeColor} style={styles.inputIcon} />
                <TextInput
                  style={styles.otpInput}
                  placeholder="Enter OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: themeColor }]}
              onPress={handleVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Send size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Verify</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.linkContainer} onPress={handleResend}>
              <Text style={styles.linkText}>Resend Code</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );

  return step === 'form' ? renderForm() : renderOtp();
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
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
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
  otpInput: {
    flex: 1,
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    letterSpacing: 8,
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

export default SignUpScreen;