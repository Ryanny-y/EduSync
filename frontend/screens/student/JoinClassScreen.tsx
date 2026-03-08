import Header from 'components/Header';
import FloatingInput from 'components/ui/FloatingInput';
import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from 'react-native';

const JoinClassScreen = () => {
  const [classCode, setClassCode] = useState<string>('');

  const handleChange = (text: string) => {
    setClassCode(text.toUpperCase());
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={50}
    >
      <Pressable className="flex-1" onPress={() => Keyboard.dismiss()}>
        <Header title="Join Class" />

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="px-4 py-6">

            {/* Title Section */}
            <View className="mb-6 px-2">
              <Text className="text-2xl font-bold text-slate-800">
                Join a Class
              </Text>

              <Text className="mt-2 text-base text-slate-500">
                Enter the class code provided by your teacher to join the class.
              </Text>
            </View>

            {/* Card */}
            <View className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">

              <FloatingInput
                label="Class Code"
                value={classCode}
                onChangeText={handleChange}
              />

              <Text className="mt-2 text-xs text-slate-400">
                Example: ABCD1234
              </Text>

              {/* Join Button */}
              <Pressable
                className={`mt-6 items-center justify-center rounded-xl py-4 ${
                  classCode.length > 0
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
                disabled={!classCode}
              >
                <Text className="font-semibold text-white">
                  Join Class
                </Text>
              </Pressable>

            </View>

          </View>
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default JoinClassScreen;