import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'components/ui/Text';
import { getFileIcon } from 'utils/helpers';
import { IFile, IUploadFile } from 'types/common';

type FileListProps = {
  files: (IUploadFile | IFile)[];
  onRemove?: (file: IFile | IUploadFile) => void;
};

const FileList = ({ files, onRemove }: FileListProps) => {
  if (!files?.length) return null;

  return (
    <View className="gap-3">
      {files.map((file, index) => {
        const fileName = 'name' in file ? file.name : file.fileName;
        const IconComponent = getFileIcon(fileName);

        return (
          <View
            key={index}
            className="flex-row items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-5">
            <View className="flex-1 flex-row items-center gap-2">
              <IconComponent size={20} color="#4B5563" />

              <Text className="flex-1" numberOfLines={1} ellipsizeMode="tail">
                {fileName}
              </Text>
            </View>

            {onRemove && (
              <Pressable onPress={() => onRemove(file)}>
                <Text className="font-semibold text-red-500">Remove</Text>
              </Pressable>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default FileList;
