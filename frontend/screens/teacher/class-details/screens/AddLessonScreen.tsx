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
import { useNavigation } from '@react-navigation/native';

const AddLessonScreen = () => {
  const [formData, setFormData] = useState<ICreateLesson>({
    title: '',
    materials: [],
  });

  const navigation = useNavigation();
  const [isUploading, setIsUploading] = useState(false);

  const { handleChange } = useFormHandlers<ICreateLesson>(setFormData);

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

    const files = result.assets.map((file) => ({
      uri: file.uri,
      name: file.name,
      type: file.mimeType ?? 'application/octet-stream',
    }));

    setFormData((prev) => ({
      ...prev,
      materials: [...(prev.materials ?? []), ...files],
    }));
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials?.filter((_, i) => i !== index),
    }));
  };

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
    console.log('adding Lesson:', formData);
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
          <Pressable
            onPress={pickDocuments}
            className="items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 active:bg-slate-100">
            <View className="mb-3 h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
              <UploadCloud size={24} color="#4f46e5" />
            </View>

            <View className="items-center">
              <Text className="text-sm font-bold text-slate-900">Click to upload files</Text>

              <Text className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                PDF, PPT, DOC, Images
              </Text>
            </View>
          </Pressable>

          {/* File List */}
          {formData.materials?.map((file, index) => {
            const IconComponent = getFileIcon(file.name);

            return (
              <View
                key={index}
                className="flex-row items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5">
                {/* Icon + File Name */}
                <View className="flex-1 flex-row items-center gap-2">
                  <IconComponent size={20} color="#4B5563" />
                  <Text className="flex-1" numberOfLines={1} ellipsizeMode="tail">
                    {file.name}
                  </Text>
                </View>

                {/* Remove Button */}
                <Pressable onPress={() => removeFile(index)}>
                  <Text className="font-semibold text-red-500">Remove</Text>
                </Pressable>
              </View>
            );
          })}

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
                {isUploading ? 'Updating...' : 'Save Changes'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddLessonScreen;
