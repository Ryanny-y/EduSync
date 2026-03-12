import Header from 'components/Header';
import FloatingInput from 'components/ui/FloatingInput';
import useFormHandlers from 'hooks/useFormHandlers';
import React, { useState } from 'react';
import { View, Pressable, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
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

type EditLessonScreenRouteProp = RouteProp<TeacherStackParamList, 'EditLessonScreen'>;

type LessonMaterial = {
  uri: string
  name: string
  type: string
  isExisting: boolean
}

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

  const pickDocuments = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: true,
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/*',
        'video/*',
      ],
    });

    if (result.canceled) return;

    const files: LessonMaterial[] = result.assets.map((file) => ({
      uri: file.uri,
      name: file.name,
      type: file.mimeType ?? 'application/octet-stream',
      isExisting: false,
    }));

    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, ...files],
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

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
      const response: ApiResponse<void> = await execute(
        `lessons/${lesson.id}`,
        {
          method: 'PUT',
          body: createFormData(),
        }
      );

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
          <Pressable
            onPress={pickDocuments}
            className="items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 active:bg-slate-100">
            
            <View className="mb-3 h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
              <UploadCloud size={24} color="#4f46e5" />
            </View>

            <View className="items-center">
              <Text className="text-sm font-bold text-slate-900">
                Upload more files
              </Text>

              <Text className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                PDF, PPT, DOC, Images
              </Text>
            </View>
          </Pressable>

          {/* Materials List */}
          {formData.materials.map((file, index) => {
            const IconComponent = getFileIcon(file.name);

            return (
              <View
                key={index}
                className="flex-row items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5">

                <View className="flex-1 flex-row items-center gap-2">
                  <IconComponent size={20} color="#4B5563" />
                  <Text numberOfLines={1} className="flex-1">
                    {file.name}
                  </Text>
                </View>

                <Pressable onPress={() => removeFile(index)}>
                  <Text className="font-semibold text-red-500">Remove</Text>
                </Pressable>
              </View>
            );
          })}

          <MessageComponent />

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => navigation.goBack()}
              disabled={isUpdating}
              className="flex-1 items-center justify-center rounded-xl bg-slate-100 p-3">

              <Text className="text-lg font-medium text-slate-700">
                Cancel
              </Text>
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