import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'components/ui/Text';
import { getFileIcon } from 'utils/helpers';

export type UploadFile = {
  uri: string;
  name: string;
  type: string;
};

type FileListProps = {
  files: UploadFile[];
  onRemove?: (index: number) => void;
};

const FileList = ({ files, onRemove }: FileListProps) => {
  if (!files?.length) return null;

  return (
    <View className="gap-3">
      {files.map((file, index) => {
        const IconComponent = getFileIcon(file.name);

        return (
          <View
            key={index}
            className="flex-row items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5"
          >
            <View className="flex-1 flex-row items-center gap-2">
              <IconComponent size={20} color="#4B5563" />

              <Text
                className="flex-1"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {file.name}
              </Text>
            </View>

            {onRemove && (
              <Pressable onPress={() => onRemove(index)}>
                <Text className="font-semibold text-red-500">
                  Remove
                </Text>
              </Pressable>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default FileList;