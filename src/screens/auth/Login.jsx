import React, { useState } from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../../components/Loader';
import Ionicons from '@react-native-vector-icons/ionicons';
import { loginUser } from '../../services/allServices';
import { useDispatch } from 'react-redux';
import { setUserCredentials } from '../../redux/slices/authSlice';
import ToastView from '../../components/Toast';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    role: 'super_admin',
  });

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isValidCredentials = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!credentials.email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address.');
      return false;
    }

    if (!emailRegex.test(credentials.email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }

    if (!credentials.password) {
      Alert.alert('Validation Error', 'Please enter your password.');
      return false;
    }

    if (credentials.password.length < 6) {
      Alert.alert(
        'Validation Error',
        'Password must be at least 6 characters long.',
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!isValidCredentials()) {
      return;
    }

    setLoading(true);

    try {
      const loginResponse = await loginUser(credentials);

      console.log('Login Response:', loginResponse);

      if (loginResponse?.status === 200 || loginResponse?.success) {
        if (typeof ToastView?.success === 'function') {
          ToastView.success(loginResponse?.message || 'Login Successful');
        } else if (typeof ToastView?.show === 'function') {
          ToastView.show(loginResponse?.message || 'Login Successful');
        } else {
          ToastView.error(
            'Success',
            loginResponse?.message || 'Logged in successfully!',
          );
        }

        if (typeof setUserCredentials === 'function') {
          dispatch(setUserCredentials(loginResponse?.access_token));
          navigation.navigate('Dashboard');
        } else {
          console.error(
            'setUserCredentials action creator is undefined. Check authSlice imports.',
          );
        }
      } else {
        const errorMessage =
          loginResponse?.data?.message ||
          loginResponse?.message ||
          'Invalid credentials. Please try again.';
        ToastView.error(errorMessage);
      }
    } catch (error) {
      const fallbackError =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong. Please try again later.';
      ToastView.error(fallbackError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2563eb' }}>
      <Loader visible={loading} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 20}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            padding: 20,
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.titleText}>
              Please enter your credentials to continue
            </Text>

            {/* Email Input */}
            <Text style={styles.loginText}>
              Email <Text style={{ color: '#ef4444' }}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={text =>
                  setCredentials({ ...credentials, email: text })
                }
                value={credentials.email}
                maxLength={100}
                editable={!loading}
                style={styles.emailInput}
              />
            </View>

            {/* Password Input */}
            <Text style={styles.loginText}>
              Password <Text style={{ color: '#ef4444' }}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter your password"
                value={credentials.password}
                onChangeText={text =>
                  setCredentials({ ...credentials, password: text })
                }
                maxLength={100}
                editable={!loading}
                secureTextEntry={!isPasswordVisible}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.iconContainer}
              >
                <Ionicons
                  name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.buttonText}>Sign in</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#000000',
  },
  emailInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  iconContainer: {
    padding: 4,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonPressed: {
    backgroundColor: '#0051A8',
    opacity: 0.9,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default Login;