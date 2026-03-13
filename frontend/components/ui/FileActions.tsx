import React from 'react';
import { Alert, Linking } from 'react-native';
import Pressable from 'components/ui/Pressable';
import { Eye, Download } from 'lucide-react-native';
import { View } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { getMimeType, getUniqueFileName } from 'utils/helpers';
import { IFile } from 'types/common';

type Props = {
  file: IFile;
};

const FileActions = ({ file }: Props) => {
  
  const handleView = () => {
    if (!file.url) return;

    Linking.openURL(file.url).catch(() => {
      Alert.alert('Error', 'Unable to open file.');
    });
  };

  const handleDownload = async () => {
    if (!file.url) return;

    try {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted) {
        Alert.alert('Permission denied', 'Cannot access storage');
        return;
      }

      const directoryUri = permissions.directoryUri;

      const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(directoryUri);
      const fileExists = files.some((uri) => uri.includes(file.fileName));
      const uniqueFileName = getUniqueFileName(file.fileName, files);

      const performDownload = async () => {
        try {
          const tempUri = FileSystem.cacheDirectory + file.fileName;

          const download = await FileSystem.downloadAsync(file.url!, tempUri);
          const base64 = await FileSystem.readAsStringAsync(download.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const mimeType = getMimeType(uniqueFileName);

          const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            directoryUri,
            uniqueFileName,
            mimeType
          );

          await FileSystem.writeAsStringAsync(newFileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          Alert.alert('Success', 'File downloaded successfully.');
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Download failed.');
        }
      };

      if (fileExists) {
        Alert.alert(
          'File Already Exists',
          'This file already exists in the selected folder. Download again?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Download Again', onPress: performDownload },
          ]
        );
      } else {
        performDownload();
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Download failed');
    }
  };

  return (
    <View className="ml-5 flex-row items-center gap-2">
      <Pressable
        onPress={handleView}
        className="rounded-lg bg-blue-100 px-3 py-3 active:opacity-70"
      >
        <Eye size={16} color="#2563EB" />
      </Pressable>

      <Pressable
        onPress={handleDownload}
        className="rounded-lg bg-green-100 px-3 py-3 active:opacity-70"
      >
        <Download size={16} color="#16A34A" />
      </Pressable>
    </View>
  );
};

export default FileActions;