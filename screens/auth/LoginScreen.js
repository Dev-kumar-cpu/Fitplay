/**
 * LoginScreen.js - User Authentication Screen
 * 
 * This is the login screen for the FitPlay mobile app.
 * It handles user authentication with email and password using Firebase Auth.
 * 
 * Features:
 * - Email and password input fields
 * - Form validation (email format, password length)
 * - Loading state during authentication
 * - Navigation to registration screen for new users
 * - Pre-filled test credentials for development
 * 
 * @module screens/auth/LoginScreen
 * @requires React
 * @requires expo-linear-gradient
 * @requires services/authService - Firebase authentication
 * @requires utils/helpers - Validation functions
 */

// React library for creating React components
import React, { useState } from 'react';
// React Native UI components for building the interface
import { 
  View,                 // Container for layout
  Text,                 // Text display component
  TextInput,           // User input field component
  TouchableOpacity,    // Touchable button component
  StyleSheet,          // CSS-like styling
  KeyboardAvoidingView, // Handles keyboard avoidance
  Platform,            // Platform-specific constants
  ScrollView,          // Scrollable container
  Alert,               // Alert dialogs
  ActivityIndicator    // Loading spinner
} from 'react-native';
// Expo library for gradient backgrounds
import { LinearGradient } from 'expo-linear-gradient';
// Authentication service for Firebase login
import { loginUser } from '../../services/authService';
// Validation helper functions
import { validateEmail, validatePassword } from '../../utils/helpers';

/**
 * LoginScreen Component
 * User authentication screen for existing users to login with email/password
 * 
 * @param {object} navigation - React Navigation object for screen navigation
 *                            Used to navigate to Register screen for new users
 * @returns {JSX.Element} The rendered LoginScreen component with:
 *                        - App logo and branding
 *                        - Email input field
 *                        - Password input field (secure)
 *                        - Login button
 *                        - Link to registration screen
 */
export const LoginScreen = ({ navigation }) => {
  // ============================================
  // STATE MANAGEMENT - Component local state
  // ============================================
  
  // Email state - stores user email input
  // Pre-filled with test credentials for development convenience
  const [email, setEmail] = useState('test@gmail.com');
  
  // Password state - stores user password input
  // Pre-filled with test credentials for development convenience
  const [password, setPassword] = useState('test123');
  
  // Loading state - tracks authentication progress
  // Shows spinner when making API call to Firebase
  const [loading, setLoading] = useState(false);
  
  // Errors state - stores form validation error messages
  // Object with keys matching field names
  const [errors, setErrors] = useState({});

  // ============================================
  // VALIDATION FUNCTIONS
  // ============================================

  /**
   * validate Function
   * Validates email and password input fields
   * Checks:
   * - Email is not empty
   * - Email format is valid
   * - Password is not empty
   * - Password is at least 6 characters
   * 
   * @returns {boolean} True if all validations pass, false otherwise
   */
  const validate = () => {
    // Create empty errors object
    const newErrors = {};
    
    // Validate email - must exist and be valid format
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Validate password - must exist and meet length requirement
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Update errors state with validation results
    setErrors(newErrors);
    
    // Return true if no errors (empty object)
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * handleLogin Function
   * Handler for login button press
   * Validates input and calls Firebase authentication
   * 
   * @async
   * @returns {Promise<void>} Updates loading state, shows alerts on error
   */
  const handleLogin = async () => {
    // Log login attempt for debugging
    console.log('Login clicked, email:', email, 'password length:', password.length);
    
    // Validate form input before attempting login
    if (!validate()) {
      console.log('Validation failed:', errors);
      return;
    }

    // Set loading state to show spinner
    setLoading(true);
    console.log('Attempting login...');
    
    try {
      // Call Firebase authentication service
      const result = await loginUser(email, password);
      console.log('Login result:', result);
      
      // Check if login was successful
      if (result.success) {
        console.log('Login successful, user:', result.data);
        // Navigation is automatically handled by AppContext state change
        // When user state changes, RootNavigator switches to AppNavigator
      } else {
        // Show error alert for failed login
        console.log('Login failed:', result.error);
        Alert.alert('Login Failed', result.error || 'Please check your credentials');
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred: ' + error.message);
    } finally {
      // Always clear loading state when done
      setLoading(false);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    // Full-screen gradient background
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      {/* KeyboardAvoidingView - Prevents keyboard from covering input fields */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* ScrollView - Allows scrolling when keyboard is visible */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section - Logo and App Name */}
          <View style={styles.header}>
            {/* App Logo Emoji */}
            <Text style={styles.logo}>🏃‍♂️</Text>
            {/* App Title */}
            <Text style={styles.title}>FitPlay</Text>
            {/* App Tagline */}
            <Text style={styles.subtitle}>Gamified Fitness Tracking</Text>
          </View>

          {/* Login Form Section */}
          <View style={styles.form}>
            {/* Form Title */}
            <Text style={styles.formTitle}>Welcome Back!</Text>
            <Text style={styles.formSubtitle}>Sign in to continue your journey</Text>

            {/* Email Input Field */}
            <View style={styles.inputContainer}>
              {/* Email Label */}
              <Text style={styles.label}>Email</Text>
              {/* Email Text Input */}
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {/* Email Error Message */}
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password Input Field */}
            <View style={styles.inputContainer}>
              {/* Password Label */}
              <Text style={styles.label}>Password</Text>
              {/* Password Text Input (secure) */}
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry
              />
              {/* Password Error Message */}
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              {/* Show spinner when loading, otherwise show text */}
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Registration Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              {/* Touchable link to registration screen */}
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

// StyleSheet for component styling
const styles = StyleSheet.create({
  // Main container - full screen with gradient
  container: {
    flex: 1,
  },
  // Keyboard avoiding view wrapper
  keyboardView: {
    flex: 1,
  },
  // Scroll view content container
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  // Header section - logo and branding
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  // Logo emoji size
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  // App title - bold white text
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  // App subtitle/tagline
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  // Form container - white card
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  // Form title
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  // Form subtitle
  formSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
  },
  // Input field container
  inputContainer: {
    marginBottom: 20,
  },
  // Input label
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  // Text input field
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  // Error state for input
  inputError: {
    borderColor: '#F44336',
  },
  // Error message text
  errorText: {
    color: '#F44336',
    fontSize: 12,
    marginTop: 5,
  },
  // Login button - primary action
  loginButton: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  // Login button text
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Registration link container
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  // "Don't have account" text
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  // "Sign Up" link - clickable
  registerLink: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
