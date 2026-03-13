import Header from 'components/Header';
import FloatingInput from 'components/ui/FloatingInput';
import useFormHandlers from 'hooks/useFormHandlers';
import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ICreateLesson } from 'types/lesson';
import { UploadCloud } from 'lucide-react-native';
import { Text } from 'components/ui/Text';
import { getFileIcon } from 'utils/helpers';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { ApiResponse } from 'types/common';
import useMutation from 'hooks/useMutation';
import { TeacherStackParamList } from 'types/navigation';
import { useMessage } from 'hooks/useMessage';
import { getErrorMessage } from 'utils/errorHandler';
import { navigateBackWithDelay } from 'utils/navigateBackWithDelay';
import FileUploader from 'components/ui/FileUploader';
import FileList from 'components/ui/FileList';

type AddLessonScreenRouteProp = RouteProp<TeacherStackParamList, 'AddLessonScreen'>;

const AddLessonScreen = () => {
  const route = useRoute<AddLessonScreenRouteProp>();
  const { classId } = route.params;
  const [formData, setFormData] = useState<ICreateLesson>({
    title: '',
    materials: [],
  });

  const navigation = useNavigation();
  const [isUploading, setIsUploading] = useState(false);
  const { execute } = useMutation();

  const { handleChange } = useFormHandlers<ICreateLesson>(setFormData);
  const { showSuccess, MessageComponent, showError } = useMessage();

  const createLessonFormData = (data: ICreateLesson) => {
    const form = new FormData();

    form.append('title', data.title);

    data.materials?.forEach((file) => {
      form.append('materials', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    });

    return form;
  };

  const handleAddLesson = async () => {
    if (isUploading) return;

    if (!formData.title.trim()) {
      alert('Lesson title is required');
      return;
    }

    setIsUploading(true);

    try {
      const response: ApiResponse<void> = await execute(`class/${classId}/lessons`, {
        method: 'POST',
        body: createLessonFormData(formData),
      });

      showSuccess(response.message);
      navigateBackWithDelay(navigation);
    } catch (error) {
      const msg = getErrorMessage(error);
      console.log('Upload failed:', error);
      showError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <Header title="Add Lesson" />
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

          {/* Upload Button */}
          <FileUploader
            onFilesSelected={(files) =>
              setFormData((prev) => ({
                ...prev,
                materials: [...(prev.materials ?? []), ...files],
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
              disabled={isUploading}
              className="flex-1 items-center justify-center rounded-xl bg-slate-100 p-3 active:bg-slate-200">
              <Text className="text-lg font-medium text-slate-700">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleAddLesson}
              disabled={isUploading}
              className={`flex-1 items-center justify-center rounded-xl p-3 ${
                isUploading ? 'bg-green-300' : 'bg-green-500'
              }`}>
              <Text className="text-lg font-medium text-white">
                {isUploading ? 'Uploading...' : 'Save Changes'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddLessonScreen;
