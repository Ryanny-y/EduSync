import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Header from 'components/Header';
import FloatingInput from 'components/ui/FloatingInput';
import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import useFormHandlers from 'hooks/useFormHandlers';
import { useMessage } from 'hooks/useMessage';
import useMutation from 'hooks/useMutation';
import { AlertTriangle, CheckCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { CreateClassType, IClass } from 'types/class';
import { ApiResponse } from 'types/common';
import { TeacherStackParamList } from 'types/navigation';
import { getErrorMessage } from 'utils/errorHandler';
import { validateCreateClass } from 'utils/validators';

type EditClassProp = RouteProp<TeacherStackParamList, 'EditClassScreen'>;

const EditClassScreen = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const route = useRoute<EditClassProp>();
  const { classData } = route.params;
  const navigation = useNavigation();
  const { execute } = useMutation();
  const { message, showError, showSuccess } = useMessage();

  // Pre-fill form data with existing class data
  const [formData, setFormData] = useState<CreateClassType>({
    name: classData.name || '',
    subject: classData.subject || '',
    section: classData.section || '',
    time: classData.time || '',
    room: classData.room || '',
    gmeetLink: classData.gmeetLink || undefined,
  });

  const { handleChange } = useFormHandlers<CreateClassType>(setFormData);

  const hasChanges = () => {
    return (
      formData.name !== (classData.name || '') ||
      formData.subject !== (classData.subject || '') ||
      formData.section !== (classData.section || '') ||
      formData.time !== (classData.time || '') ||
      formData.room !== (classData.room || '') ||
      (formData.gmeetLink || '') !== (classData.gmeetLink || '')
    );
  };

  const handleUpdateClass = async () => {
    if (isUpdating) return;
    setIsUpdating(true);

    if(!hasChanges()) {
      showError('No changes detected');
      setIsUpdating(false);
      return;
    }

    const error = validateCreateClass(formData);
    if (error) {
      showError(error);
      setIsUpdating(false);
      return;
    }

    try {
      const response: ApiResponse<IClass> = await execute(`class/${classData.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });

      showSuccess(response.message || 'Class updated successfully');
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error: any) {
      showError(getErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={50}>
      <Pressable className="flex-1 bg-slate-50" onPress={() => Keyboard.dismiss()}>
        <Header title="Edit Class" />

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

          {message && (
            <View
              className={`mx-4 mb-3 flex-row items-center gap-2 rounded-lg p-3 ${
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

          <View className="flex-row gap-3 px-4 pb-4">
            <Pressable
              onPress={() => navigation.goBack()}
              disabled={isUpdating}
              className="flex-1 items-center justify-center rounded-xl bg-slate-100 p-3 active:bg-slate-200">
              <Text className="text-lg font-medium text-slate-700">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleUpdateClass}
              disabled={isUpdating}
              className={`flex-1 items-center justify-center rounded-xl p-3 ${
                isUpdating ? 'bg-green-300' : 'bg-green-500'
              }`}>
              <Text className="text-lg font-medium text-white">
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

export default EditClassScreen;
