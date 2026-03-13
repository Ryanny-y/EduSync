import Header from 'components/Header';
import FloatingInput from 'components/ui/FloatingInput';
import useFormHandlers from 'hooks/useFormHandlers';
import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import { Text } from 'components/ui/Text';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ApiResponse } from 'types/common';
import useMutation from 'hooks/useMutation';
import { TeacherStackParamList } from 'types/navigation';
import { useMessage } from 'hooks/useMessage';
import { getErrorMessage } from 'utils/errorHandler';
import { navigateBackWithDelay } from 'utils/navigateBackWithDelay';
import FileList from 'components/ui/FileList';
import FileUploader from 'components/ui/FileUploader';

type EditLessonScreenRouteProp = RouteProp<TeacherStackParamList, 'EditLessonScreen'>;

const EditLessonScreen = () => {
  const route = useRoute<EditLessonScreenRouteProp>();
  const { lesson } = route.params;

  const navigation = useNavigation();
  const { execute } = useMutation();
  const { showSuccess, showError, MessageComponent } = useMessage();

  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    title: lesson.title || '',
    materials:
      lesson.materials?.map((file: any) => ({
        uri: file.url,
        name: file.name,
        type: file.type,
        isExisting: true,
      })) || [],
  });

  const { handleChange } = useFormHandlers<typeof formData>(setFormData);

  const createFormData = () => {
    const form = new FormData();

    form.append('title', formData.title);

    formData.materials.forEach((file) => {
      if (!file.isExisting) {
        form.append('materials', {
          uri: file.uri,
          name: file.name,
          type: file.type,
        } as any);
      }
    });

    return form;
  };

  const handleUpdateLesson = async () => {
    if (isUpdating) return;

    if (!formData.title.trim()) {
      showError('Lesson title is required');
      return;
    }

    setIsUpdating(true);

    try {
      const response: ApiResponse<void> = await execute(`lessons/${lesson.id}`, {
        method: 'PUT',
        body: createFormData(),
      });

      showSuccess(response.message || 'Lesson updated successfully');
      navigateBackWithDelay(navigation);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <Header title="Edit Lesson" />

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="gap-4 px-4 py-5">
          <FloatingInput
            label="Lesson Title"
            value={formData.title}
            onChangeText={(text) => handleChange('title', text)}
          />

          {/* Upload Files */}
          <FileUploader
            onFilesSelected={(files) =>
              setFormData((prev) => ({
                ...prev,
                materials: [
                  ...(prev.materials ?? []),
                  ...files.map((file) => ({
                    ...file,
                    isExisting: false,
                  })),
                ],
              }))
            }
          />

          <FileList
            files={formData.materials ?? []}
            onRemove={(index) =>
              setFormData((prev) => ({
                ...prev,
                materials: prev.materials?.filter((_, i) => i !== index),
              }))
            }
          />

          <MessageComponent />

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => navigation.goBack()}
              disabled={isUpdating}
              className="flex-1 items-center justify-center rounded-xl bg-slate-100 p-3">
              <Text className="text-lg font-medium text-slate-700">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleUpdateLesson}
              disabled={isUpdating}
              className={`flex-1 items-center justify-center rounded-xl p-3 ${
                isUpdating ? 'bg-green-300' : 'bg-green-500'
              }`}>
              <Text className="text-lg font-medium text-white">
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditLessonScreen;
