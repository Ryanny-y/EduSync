import { useState } from 'react';
import {
  View,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { CreateUserForm } from 'types/User';
import { AuthStackParamList } from 'types/navigation';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
import Logo from 'screens/shared/Logo';
import { Text } from 'components/ui/Text';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from 'context/AuthContext';
import FormInput from './signup/FormInput';
import DepartmentPicker from './signup/DepartmentPicker';
import { useSignupForm } from './signup/useSignupForm';
import Pressable from 'components/ui/Pressable';

type SignupRouteProp = RouteProp<AuthStackParamList, 'SignupScreen'>;

type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignupScreen'>;

const SignUpScreen = () => {
  const route = useRoute<SignupRouteProp>();
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();

  const { role } = route.params;
  const {
    formData,
    formErrors,
    message,
    isLoading,
    setIsLoading,
    setMessage,
    handleChange,
    validateForm,
    resetMessage,
  } = useSignupForm(role);

  const handleSignup = async () => {
    if (isLoading) return;

    if (!validateForm()) return;

    setIsLoading(true);
    resetMessage();

    try {
      await signup(formData);

      setMessage({
        type: 'success',
        text: 'Signup successful! Redirecting to login...',
      });

      setTimeout(() => {
        navigation.replace('LoginScreen', { role });
      }, 2000);
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Signup failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={40}>
      <Pressable className="flex-1" onPress={() => Keyboard.dismiss()}>
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{
            paddingTop: 100,
            paddingBottom: 50,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Pressable className="absolute top-16 z-10" onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color="#334155" />
          </Pressable>

          {/* Logo & Heading */}
          <View className="mb-10 items-center">
            <Logo size={80} />
            <View className="mt-5 items-center">
              <Text className="text-[28px] font-bold">Create Your Account</Text>
              <Text className="mt-1.5 text-slate-500">Create account as {role.toLowerCase()}</Text>
            </View>
          </View>

          {/* Form Inputs */}
          <View className="w-full">
            <FormInput
              label="First Name"
              value={formData.firstName}
              placeholder="Enter your first name"
              error={formErrors.firstName}
              onChange={(value) => handleChange('firstName', value)}
            />
            <FormInput
              label="Middle Name"
              value={formData.middleName}
              placeholder="Enter your middle name"
              error={formErrors.middleName}
              onChange={(value) => handleChange('middleName', value)}
            />
            <FormInput
              label="Last Name"
              value={formData.lastName}
              placeholder="Enter your last name"
              error={formErrors.lastName}
              onChange={(value) => handleChange('lastName', value)}
            />
            <FormInput
              label="Email"
              value={formData.email}
              placeholder="Enter your email"
              error={formErrors.email}
              keyboardType="email-address"
              onChange={(value) => handleChange('email', value)}
            />
            <FormInput
              label="Password"
              value={formData.password}
              placeholder="Enter your password"
              secure
              show={showPassword}
              toggleShow={() => setShowPassword(!showPassword)}
              error={formErrors.password}
              onChange={(value) => handleChange('password', value)}
            />
            <FormInput
              label="Confirm Password"
              value={formData.confirmPassword}
              placeholder="Confirm your password"
              secure
              show={showConfirmPassword}
              toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
              error={formErrors.confirmPassword}
              onChange={(value) => handleChange('confirmPassword', value)}
            />
            {role === 'TEACHER' && (
              <DepartmentPicker
                value={formData.departmentId}
                error={formErrors.departmentId}
                onChange={(value) => handleChange('departmentId', value)}
              />
            )}

            {/* Signup Button */}
            {message && (
              <Text
                className={`mb-3 text-center ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {message.text}
              </Text>
            )}
            <Pressable
              onPress={handleSignup}
              className={`items-center rounded-xl ${isLoading ? 'bg-green-300' : 'bg-green-500'} py-4`}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="font-semibold text-white">Create Account</Text>
              )}
            </Pressable>

            <View className="mt-5 items-center">
              <Text>Already have an account?</Text>
              <Pressable
                className="mt-2"
                onPress={() => navigation.replace('LoginScreen', { role })}>
                <Text className="text-lg font-semibold text-green-500">Login</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
