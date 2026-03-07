import { useState } from 'react';
import { View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { CreateUserForm } from 'types/User';
import { AuthStackParamList } from 'types/navigation';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
import Logo from 'screens/shared/Logo';
import { Text } from 'components/ui/Text';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from 'context/AuthContext';
import FormInput from './signup/FormInput';
import DepartmentPicker from './signup/DepartmentPicker';
import { useSignupForm } from './signup/useSignupForm';

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

  const renderInput = (
    label: string,
    field: keyof CreateUserForm,
    placeholder: string,
    secure = false,
    show = false,
    toggleShow?: () => void,
    keyboardType?: 'default' | 'email-address'
  ) => (
    <View className="mb-3 gap-[6px]">
      <Text className="font-semibold text-slate-500">{label}</Text>
      <View
        className={`rounded-xl border px-3 py-2 ${formErrors[field] ? 'border-red-500' : 'border-slate-200'} flex-row items-center`}>
        {secure && <Lock size={16} color="#94a3b8" />}
        <TextInput
          placeholder={placeholder}
          value={formData[field]}
          onChangeText={(text) => handleChange(field, text)}
          className="ml-2 flex-1 text-base"
          secureTextEntry={secure && !show}
          placeholderTextColor="#94a3b8"
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        />
        {toggleShow && (
          <TouchableOpacity onPress={toggleShow}>
            {show ? <EyeOff size={18} color="#64748b" /> : <Eye size={18} color="#64748b" />}
          </TouchableOpacity>
        )}
      </View>
      {formErrors[field] && <Text className="text-sm text-red-500">{formErrors[field]}</Text>}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 100, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid>
        {/* Back Button */}
        <TouchableOpacity
          className="absolute left-5 top-6 z-10"
          onPress={() => navigation.goBack()}>
          <ArrowLeft size={20} color="#334155" />
        </TouchableOpacity>

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
          <TouchableOpacity
            onPress={handleSignup}
            className={`items-center rounded-xl ${isLoading ? 'bg-green-300' : 'bg-green-500'} py-4`}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-semibold text-white">Create Account</Text>
            )}
          </TouchableOpacity>

          <View className="mt-5 items-center">
            <Text>Already have an account?</Text>
            <TouchableOpacity
              className="mt-2"
              onPress={() => navigation.replace('LoginScreen', { role })}>
              <Text className="text-lg font-semibold text-green-500">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
