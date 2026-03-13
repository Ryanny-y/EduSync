import { View } from 'react-native';
import { Text } from './ui/Text';
import { IFile } from 'types/common';
import { getFileIcon } from 'utils/helpers';
import dayjs from 'dayjs';
import FileActions from './ui/FileActions';

const FileCard = ({ file }: { file: IFile }) => {
  const IconComponent = getFileIcon(file.fileName);

  return (
    <View className="flex-row items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* File Info Section */}
      <View className="flex-1 flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
          <IconComponent size={20} color="#4B5563" />
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-slate-800" numberOfLines={2}>
            {file.fileName}
          </Text>

          <View className="mt-1 flex-row items-center justify-between">
            <View className="rounded-full bg-slate-100 px-2 py-1">
              <Text className="text-xs font-medium uppercase text-slate-500">{file.fileType}</Text>
            </View>

            <Text className="text-xs text-gray-400">
              {dayjs(file.createdAt).format('MMM DD, YYYY')}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <FileActions file={file} />
    </View>
  );
};

export default FileCard;
