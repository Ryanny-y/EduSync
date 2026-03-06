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
import { validateEmail, validatePassword } from 'utils/validators';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from 'context/AuthContext';

type SignupRouteProp = RouteProp<AuthStackParamList, 'SignupScreen'>;

type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignupScreen'>;

const SignUpScreen = () => {
  const route = useRoute<SignupRouteProp>();
  const navigation = useNavigation<SignupScreenNavigationProp>();

  const { role } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<CreateUserForm>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: role,
    department: '',
  });

  // New: inline error state
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateUserForm, string>>>({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSignup = async () => {
    if (isLoading) return;

    const errors: Partial<Record<keyof CreateUserForm, string>> = {};

    // Field validation
    if (!formData.firstName) errors.firstName = 'First name is required.';
    if (!formData.middleName) errors.middleName = 'Middle name is required.';
    if (!formData.lastName) errors.lastName = 'Last name is required.';
    if (!formData.email) errors.email = 'Email is required.';
    if (!validateEmail(formData.email)) errors.email = 'Please enter a valid email address.';
    if (!formData.password) errors.password = 'Password is required.';
    if (!formData.confirmPassword) errors.confirmPassword = 'Confirm your password.';
    if (role === 'TEACHER' && !formData.department) errors.department = 'Department is required.';

    // Password match
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    // Password strength
    if (formData.password) {
      const pass = validatePassword(formData.password);
      if (!pass.hasNumber || !pass.hasUpper || !pass.isLongEnough) {
        errors.password =
          'Password must be at least 8 characters, 1 uppercase letter, and 1 number.';
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    setMessage(null);
    try {
      await signup(formData);
      setMessage({ type: 'success', text: 'Signup successful! Redirecting to login...' });

      setTimeout(() => {
        navigation.replace('LoginScreen', { role });
      }, 2000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof CreateUserForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));

    if (field === 'email' && value.length > 0 && !validateEmail(value)) {
      setFormErrors((prev) => ({ ...prev, email: 'Invalid email address' }));
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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        className="flex-1 bg-white"
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
          {renderInput('First Name', 'firstName', 'Enter your first name')}
          {renderInput('Middle Name', 'middleName', 'Enter your middle name')}
          {renderInput('Last Name', 'lastName', 'Enter your last name')}
          {renderInput(
            'Email',
            'email',
            'Enter your email',
            false,
            false,
            undefined,
            'email-address'
          )}
          {renderInput('Password', 'password', 'Enter your password', true, showPassword, () =>
            setShowPassword(!showPassword)
          )}
          {renderInput(
            'Confirm Password',
            'confirmPassword',
            'Confirm your password',
            true,
            showConfirmPassword,
            () => setShowConfirmPassword(!showConfirmPassword)
          )}
          {role === 'TEACHER' && (
            <View className="mb-3 gap-[6px]">
              <Text className="font-semibold text-slate-500">Department</Text>

              <View className="rounded-xl border border-slate-200">
                <Picker
                  selectedValue={formData.department}
                  onValueChange={(itemValue) => handleChange('department', itemValue)}>
                  <Picker.Item label="Select Department" value="" />
                  <Picker.Item label="SOCSCI" value="SOCSCI" />
                  <Picker.Item label="NATSCI" value="NATSCI" />
                  <Picker.Item label="ENGSOC" value="ENGSOC" />
                  <Picker.Item label="MAPS" value="MAPS" />
                  <Picker.Item label="ICT" value="ICT" />
                </Picker>
              </View>

              {formErrors.department && (
                <Text className="text-sm text-red-500">{formErrors.department}</Text>
              )}
            </View>
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
            className={`items-center rounded-xl ${isLoading ? 'bg-indigo-300' : 'bg-indigo-500'} py-4`}
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
              <Text className="text-lg font-semibold text-indigo-500">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUpScreen;
