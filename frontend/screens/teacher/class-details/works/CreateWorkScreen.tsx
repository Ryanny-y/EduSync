import { Picker } from '@react-native-picker/picker';
import Header from 'components/Header';
import FormInput from 'components/ui/FormInput';
import { Text } from 'components/ui/Text';
import useFormHandlers from 'hooks/useFormHandlers';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ICreateWork, workTypes } from 'types/work';
import FileUploader from 'components/ui/FileUploader';
import FileList from 'components/ui/FileList';
import { useMessage } from 'hooks/useMessage';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import DateTimeField from 'components/ui/DateTimeField';
import { getErrorMessage } from 'utils/errorHandler';
import { navigateBackWithDelay } from 'utils/navigateBackWithDelay';
import { ApiResponse } from 'types/common';
import useMutation from 'hooks/useMutation';
import { TeacherStackParamList } from 'types/navigation';
import FormTextArea from 'components/ui/FormTextArea';
import FloatingInput from 'components/ui/FloatingInput';

type CreateWorkScreenRouteProp = RouteProp<TeacherStackParamList, 'CreateWorkScreen'>;

const CreateWorkScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<CreateWorkScreenRouteProp>();
  const { classId } = route.params;
  const [isPublishing, setIsPublishing] = useState(false);
  const { execute } = useMutation();

  const [formData, setFormData] = useState<ICreateWork>({
    title: '',
    description: '',
    type: 'ASSIGNMENT',
    dueDate: null,
    materials: [],
  });

  const { showSuccess, MessageComponent, showError } = useMessage();
  const { handleChange } = useFormHandlers<ICreateWork>(setFormData);

  const createLessonFormData = (data: ICreateWork) => {
    const form = new FormData();

    form.append('title', data.title);
    form.append('type', data.type);

    if (data.description) {
      form.append('description', data.description);
    }

    if (data.dueDate) {
      form.append('dueDate', data.dueDate.toISOString());
    }

    data.materials?.forEach((file) => {
      form.append('materials', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
    });

    return form;
  };

  const handleCreateWork = async () => {
    if (isPublishing) return;

    if (!formData.title.trim()) {
      alert('Lesson title is required');
      return;
    }

    setIsPublishing(true);

    try {
      const response: ApiResponse<void> = await execute(`class/${classId}/works`, {
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
      setIsPublishing(false);
    }
  };
  return (
    <View className="flex-1 bg-slate-50">
      <Header title="Create Work" />

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="gap-4 px-4 py-5">
          <FormInput
            label="Title"
            value={formData.title}
            onChangeText={(value) => handleChange('title', value)}
            placeholder="e.g. Essay: Climate Change"
          />

          <FormTextArea
            label="description"
            value={formData.description ?? ''}
            onChangeText={(value) => handleChange('description', value)}
            placeholder="Provide instructions for students"
          />

          <View className="flex-row items-center gap-2">
            {/* Work Type */}
            <View className={`flex-1`}>
              <Text className="mb-2 text-sm font-bold uppercase text-gray-400">Work Type</Text>

              <View className="rounded-lg border  border-gray-200 bg-gray-100">
                <Picker
                  selectedValue={formData.type}
                  onValueChange={(itemValue) =>
                    setFormData((prev) => ({ ...prev, type: itemValue }))
                  }>
                  {workTypes.map((workType) => (
                    <Picker.Item
                      style={{ fontSize: 14, color: '#1e293b' }}
                      key={workType}
                      label={`${workType[0]}${workType.slice(1).toLowerCase()}`}
                      value={workType}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Due Date */}
            <View className="flex-1">
              <DateTimeField
                label="Due Date"
                placeholder="No Due Date"
                value={formData.dueDate}
                onChange={(date) => handleChange('dueDate', date)}
              />
            </View>
          </View>

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
              disabled={isPublishing}
              className="flex-1 items-center justify-center rounded-xl bg-slate-100 p-3 active:bg-slate-200">
              <Text className="text-lg font-medium text-slate-700">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleCreateWork}
              disabled={isPublishing}
              className={`flex-1 items-center justify-center rounded-xl p-3 ${
                isPublishing ? 'bg-green-300' : 'bg-green-500'
              }`}>
              <Text className="text-lg font-medium text-white">
                {isPublishing ? 'Uploading...' : 'Publish Work'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateWorkScreen;
