import { useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AuthStackParamList } from 'types/navigation';
import {
  View,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import { Text } from 'components/ui/Text';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react-native';
import Logo from 'screens/shared/Logo';
import { useAuth } from 'context/AuthContext';
import { validateEmail } from 'utils/validators';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Pressable from 'components/ui/Pressable';

type LoginRouteProp = RouteProp<AuthStackParamList, 'LoginScreen'>;

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'LoginScreen'>;

const LoginScreen = () => {
  const route = useRoute<LoginRouteProp>();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();

  const { role } = route.params;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Real-time validation
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text && !validateEmail(text)) {
      setEmailError('Invalid Email Address');
    } else {
      setEmailError(null);
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (!text) {
      setPasswordError('Password cannot be empty');
    } else {
      setPasswordError(null);
    }
  };

  const handleLogin = async () => {
    if (isLoading) return;

    // Validate before login
    let hasError = false;
    if (!email) {
      setEmailError('Email cannot be empty');
      hasError = true;
    }
    if (!password) {
      setPasswordError('Password cannot be empty');
      hasError = true;
    }
    if (email && !validateEmail(email)) {
      setEmailError('Invalid Email Address');
      hasError = true;
    }
    if (hasError) return;

    setIsLoading(true);
    try {
      await login(email, password, role);
      setLoginError(null);
    } catch (error: any) {
      setLoginError(error.message);
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
            paddingTop: 160,
            paddingBottom: 50,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Back Button */}
          <Pressable className="absolute top-16" onPress={() => navigation.goBack()}>
            <ArrowLeft size={20} color="#334155" />
          </Pressable>

          {/* Header */}
          <View className="mb-10 items-center">
            <Logo size={80} />
            <View className="mt-5 items-center">
              <Text className="text-[28px] font-bold">Welcome Back</Text>
              <Text className="mt-1.5 text-slate-500">Sign in as {role.toLowerCase()}</Text>
            </View>
          </View>

          {/* Form */}
          <View className="w-full">
            {/* Email */}
            <View className="mb-[14px] flex-row items-center gap-[10px] rounded-[14px] border border-slate-200 px-[14px] py-3">
              <Mail size={20} color="#94a3b8" />
              <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={handleEmailChange}
                className="flex-1 text-slate-700"
              />
            </View>
            {emailError && <Text className="text-sm text-red-500">{emailError}</Text>}

            {/* Password */}
            <View className="mb-[14px] flex-row items-center gap-[10px] rounded-[14px] border border-slate-200 px-[14px] py-3">
              <Lock size={20} color="#94a3b8" />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={handlePasswordChange}
                secureTextEntry={!showPassword}
                className="flex-1 text-slate-700"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#94a3b8" />
                ) : (
                  <Eye size={20} color="#94a3b8" />
                )}
              </Pressable>
            </View>
            {passwordError && <Text className="text-sm text-red-500">{passwordError}</Text>}

            {/* Login Error */}
            {loginError && (
              <View className="flex-row items-center gap-[6px] rounded-[10px] bg-red-50 p-[10px]">
                <AlertCircle size={18} color="#ef4444" />
                <Text className="text-red-500">{loginError}</Text>
              </View>
            )}

            {/* Login Button */}
            <Pressable
              className="mt-[10px] items-center rounded-[14px] bg-green-500 py-4"
              onPress={handleLogin}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="font-bold text-white">Log In</Text>
              )}
            </Pressable>

            {/* Signup */}
            <View className="mt-5 items-center">
              <Text>Don't have an account?</Text>
              <Pressable
                className="mt-2"
                onPress={() => navigation.navigate('SignupScreen', { role })}>
                <Text className="font-semibold text-green-500">Signup</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
