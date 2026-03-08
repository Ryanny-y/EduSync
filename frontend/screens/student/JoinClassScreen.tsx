import { useNavigation } from '@react-navigation/native';
import Header from 'components/Header';
import FloatingInput from 'components/ui/FloatingInput';
import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import { useMessage } from 'hooks/useMessage';
import useMutation from 'hooks/useMutation';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react-native';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { IClass } from 'types/class';
import { ApiResponse } from 'types/common';
import { getErrorMessage } from 'utils/errorHandler';

const JoinClassScreen = () => {
  const [classCode, setClassCode] = useState<string>('');
  const [isJoining, setIsJoining] = useState(false);
  const { execute } = useMutation();
  const navigation = useNavigation();
  const { message, showError, showSuccess, clearMessage } = useMessage();

  const handleJoinClass = async () => {
    if (isJoining) return;
    setIsJoining(true);

    if (!classCode) {
      showError('Class code is required.');
      return;
    }

    if (classCode.length !== 8) {
      showError('Invalid class code.');
      return;
    }

    try {
      const response: ApiResponse<IClass> = await execute('class/join', {
        method: 'POST',
        body: JSON.stringify({ code: classCode }),
      });

      showSuccess(response.message);
      setClassCode('');
      setTimeout(() => {
        clearMessage();
        navigation.goBack();
      }, 1000);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={50}>
      <Pressable className="flex-1" onPress={() => Keyboard.dismiss()}>
        <Header title="Join Class" />

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="px-4 py-6">
            {/* Title Section */}
            <View className="mb-6 px-2">
              <Text className="text-2xl font-bold text-slate-800">Join a Class</Text>

              <Text className="mt-2 text-base text-slate-500">
                Enter the class code provided by your teacher to join the class.
              </Text>
            </View>

            {/* Card */}
            <View className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <FloatingInput
                label="Class Code"
                value={classCode}
                maxLength={8}
                onChangeText={setClassCode}
              />

              <View className="mb-3 mt-2 flex-row items-center gap-2">
                <Info size={14} color="#64748b" />
                <Text className="text-xs text-slate-400">
                  Example: ABCD1234 • Code must be 8 characters
                </Text>
              </View>

              {message && (
                <View
                  className={`mb-3 flex-row items-center gap-2 rounded-lg p-3 ${
                    message.type === 'error' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                  {message.type === 'error' ? (
                    <AlertTriangle size={20} color="#dc2626" />
                  ) : (
                    <CheckCircle size={20} color="#16a34a" />
                  )}

                  <Text
                    className={`flex-1 text-sm font-medium ${
                      message.type === 'error' ? 'text-red-600' : 'text-green-600'
                    }`}>
                    {message.message}
                  </Text>
                </View>
              )}

              {/* Join Button */}
              <Pressable
                onPress={handleJoinClass}
                className={`mt-0 items-center justify-center rounded-xl py-4 ${
                  classCode.length === 8 ? 'bg-green-500' : 'bg-gray-300'
                }`}
                disabled={!classCode || classCode.length !== 8}>
                <Text className="font-semibold text-white">Join Class</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default JoinClassScreen;
