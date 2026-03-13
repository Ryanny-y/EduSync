import React from 'react';
import { Pressable, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { UploadCloud } from 'lucide-react-native';
import { Text } from 'components/ui/Text';

export type UploadFile = {
  uri: string;
  name: string;
  type: string;
};

type FileUploaderProps = {
  title?: string;
  onFilesSelected: (files: UploadFile[]) => void;
  showButton?: boolean;
};

const FileUploader = ({
  title = 'Click to upload files',
  onFilesSelected,
  showButton,
}: FileUploaderProps) => {
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

    const files: UploadFile[] = result.assets.map((file) => ({
      uri: file.uri,
      name: file.name,
      type: file.mimeType ?? 'application/octet-stream',
    }));

    onFilesSelected(files);
  };

  return (
    <Pressable
      onPress={pickDocuments}
      className="items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 active:bg-slate-100">
      <View className="mb-3 h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">
        <UploadCloud size={24} color="#4f46e5" />
      </View>

      <View className="items-center">
        <Text className="text-sm font-bold text-slate-900">{title}</Text>

        <Text className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          PDF, PPT, DOC, Images
        </Text>

        {showButton && (
          <Text className="mt-5 rounded-xl border-2 border-slate-200/50 px-5 py-2 text-sm">
            Browse Files
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default FileUploader;
