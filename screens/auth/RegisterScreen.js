/**
 * RegisterScreen.js - New User Registration Screen
 * 
 * This is the registration screen for new users to create a FitPlay account.
 * It handles user registration with email, password, and display name using Firebase Auth.
 * 
 * Features:
 * - Display name input field
 * - Email and password input fields
 * - Password confirmation field
 * - Form validation (name length, email format, password strength, password match)
 * - Loading state during authentication
 * - Navigation to login screen for existing users
 * 
 * @module screens/auth/RegisterScreen
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
// Authentication service for Firebase registration
import { registerUser } from '../../services/authService';
// Validation helper functions
import { validateEmail, validatePassword } from '../../utils/helpers';

/**
 * RegisterScreen Component
 * User registration screen for new users to create an account
 * 
 * @param {object} navigation - React Navigation object for screen navigation
 *                            Used to navigate to Login screen for existing users
 * @returns {JSX.Element} The rendered RegisterScreen component with:
 *                        - App logo and branding
 *                        - Display name input field
 *                        - Email input field
 *                        - Password input field (secure)
 *                        - Confirm password input field (secure)
 *                        - Registration button
 *                        - Link to login screen
 */
export const RegisterScreen = ({ navigation }) => {
  // ============================================
  // STATE MANAGEMENT - Component local state
  // ============================================
  
  // Display name state - stores user's chosen display name
  // Shown on profile and in leaderboards
  const [displayName, setDisplayName] = useState('');
  
  // Email state - stores user's email address
  const [email, setEmail] = useState('');
  
  // Password state - stores user's chosen password
  const [password, setPassword] = useState('');
  
  // Confirm password state - for password matching validation
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Loading state - tracks registration progress
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
   * Validates all registration form fields
   * Checks:
   * - Display name: must be at least 2 characters
   * - Email: must exist and be valid format
   * - Password: must meet minimum strength requirements
   * - Confirm password: must match password exactly
   * 
   * @returns {boolean} True if all validations pass, false otherwise
   */
  const validate = () => {
    // Create empty errors object
    const newErrors = {};
    
    // Validate display name - must be at least 2 characters
    if (!displayName || displayName.trim().length < 2) {
      newErrors.displayName = 'Name must be at least 2 characters';
    }
    
    // Validate email - must exist and be valid format
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    // Validate password using helper function
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }
    
    // Validate password confirmation - must match
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
   * handleRegister Function
   * Handler for registration button press
   * Validates input and calls Firebase authentication to create new account
   * 
   * @async
   * @returns {Promise<void>} Updates loading state, shows alerts on success/error
   */
  const handleRegister = async () => {
    // Validate form input before attempting registration
    if (!validate()) return;

    // Set loading state to show spinner
    setLoading(true);
    
    try {
      // Call Firebase authentication service with user data
      // Trim display name to remove extra whitespace
      const result = await registerUser(email, password, displayName.trim());
      
      // Check if registration was successful
      if (result.success) {
        // Show success alert and navigate to login
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        // Show error alert for failed registration
        Alert.alert('Registration Failed', result.error || 'Please try again');
      }
    } catch (error) {
      // Catch any unexpected errors
      Alert.alert('Error', 'An unexpected error occurred');
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
            <Text style={styles.subtitle}>Join the Fitness Revolution</Text>
          </View>

          {/* Registration Form Section */}
          <View style={styles.form}>
            {/* Form Title */}
            <Text style={styles.formTitle}>Create Account</Text>
            <Text style={styles.formSubtitle}>Start your gamified fitness journey</Text>

            {/* Display Name Input Field */}
            <View style={styles.inputContainer}>
              {/* Display Name Label */}
              <Text style={styles.label}>Display Name</Text>
              {/* Display Name Text Input */}
              <TextInput
                style={[styles.input, errors.displayName && styles.inputError]}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your name"
                placeholderTextColor="#999"
                autoCapitalize="words"
              />
              {/* Display Name Error Message */}
              {errors.displayName && <Text style={styles.errorText}>{errors.displayName}</Text>}
            </View>

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
                placeholder="Create a password"
                placeholderTextColor="#999"
                secureTextEntry
              />
              {/* Password Error Message */}
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password Input Field */}
            <View style={styles.inputContainer}>
              {/* Confirm Password Label */}
              <Text style={styles.label}>Confirm Password</Text>
              {/* Confirm Password Text Input (secure) */}
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                secureTextEntry
              />
              {/* Confirm Password Error Message */}
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* Registration Button */}
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
            >
              {/* Show spinner when loading, otherwise show text */}
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link - For existing users */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              {/* Touchable link to login screen */}
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
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
    marginBottom: 30,
  },
  // Logo emoji size
  logo: {
    fontSize: 50,
    marginBottom: 10,
  },
  // App title - bold white text
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  // App subtitle/tagline
  subtitle: {
    fontSize: 14,
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
    marginBottom: 15,
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
  // Registration button - primary action
  registerButton: {
    backgroundColor: '#667eea',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  // Registration button text
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Login link container
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  // "Already have account" text
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  // "Sign In" link - clickable
  loginLink: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
