import { useNavigation } from '@react-navigation/native';
import Header from 'components/Header';
import FloatingInput from 'components/ui/FloatingInput';
import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import useFormHandlers from 'hooks/useFormHandlers';
import useMutation from 'hooks/useMutation';
import { AlertTriangle, CheckCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { CreateClassType, IClass } from 'types/class';
import { ApiResponse } from 'types/common';
import { validateCreateClass } from 'utils/validators';

const CreateClassScreen = () => {
  const [isCreating, setIsCreating] = useState(false);
  const navigation = useNavigation();
  const { execute } = useMutation();
  const [message, setMessage] = useState<{ status: 'error' | 'success'; message: string } | null>(
    null
  );
  const [formData, setFormData] = useState<CreateClassType>({
    name: '',
    subject: '',
    section: '',
    time: '',
    room: '',
    gmeetLink: undefined,
  });

  const { handleChange } = useFormHandlers<CreateClassType>(setFormData);

  const handleCreateClass = async () => {
    if (isCreating) return;
    setIsCreating(true);

    const error = validateCreateClass(formData);
    if (error) {
      setMessage({ status: 'error', message: error });
      return;
    }

    try {
      const response: ApiResponse<IClass> = await execute('class', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      setMessage({ status: 'success', message: response.message });
      setFormData({
        name: '',
        subject: '',
        section: '',
        time: '',
        room: '',
        gmeetLink: undefined,
      });
      setTimeout(() => {
        setMessage(null);
        navigation.goBack();
      }, 1000);
    } catch (error: any) {
      setMessage({ status: 'error', message: error.message });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={50}>
      <Pressable className="flex-1 bg-slate-50" onPress={() => Keyboard.dismiss()}>
        <Header title="Create Class" />

        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="px-4 py-5">
            <FloatingInput
              label="Class Name"
              value={formData.name}
              onChangeText={(text) => handleChange('name', text)}
            />
            <FloatingInput
              label="Subject"
              value={formData.subject}
              onChangeText={(text) => handleChange('subject', text)}
            />
            <FloatingInput
              label="Section"
              value={formData.section}
              onChangeText={(text) => handleChange('section', text)}
            />
            <FloatingInput
              label="Time"
              value={formData.time}
              onChangeText={(text) => handleChange('time', text)}
            />
            <FloatingInput
              label="Room"
              value={formData.room}
              onChangeText={(text) => handleChange('room', text)}
            />
            <FloatingInput
              label="Google Meet Link"
              value={formData.gmeetLink || ''}
              onChangeText={(text) => handleChange('gmeetLink', text)}
              inputProps={{ keyboardType: 'url' }}
            />
          </View>
        </ScrollView>

        {message && (
          <View
            className={`mx-4 mb-3 flex-row items-center gap-2 rounded-lg p-3 ${
              message.status === 'error' ? 'bg-red-100' : 'bg-green-100'
            }`}>
            {message.status === 'error' ? (
              <AlertTriangle size={20} color="#dc2626" />
            ) : (
              <CheckCircle size={20} color="#16a34a" />
            )}

            <Text
              className={`flex-1 text-sm font-medium ${
                message.status === 'error' ? 'text-red-600' : 'text-green-600'
              }`}>
              {message.message}
            </Text>
          </View>
        )}

        <View className="flex-row gap-3 px-4 pb-4">
          <Pressable
            onPress={handleCreateClass}
            disabled={isCreating}
            className={`flex-1 items-center justify-center rounded-xl p-3 ${
              isCreating ? 'bg-green-400' : 'bg-green-600/80'
            }`}>
            <Text className="text-lg font-medium text-white">Create Class</Text>
          </Pressable>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default CreateClassScreen;
