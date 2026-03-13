import { RouteProp, useRoute } from '@react-navigation/native';
import Header from 'components/Header';
import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import dayjs from 'dayjs';
import { Book, Download, Eye } from 'lucide-react-native';
import React from 'react';
import { Alert, Linking, ScrollView, View } from 'react-native';
import { ILessonMaterial } from 'types/lesson';
import { TeacherStackParamList } from 'types/navigation';
import { getFileIcon, getMimeType, getUniqueFileName } from 'utils/helpers';
import * as FileSystem from 'expo-file-system/legacy';
import FileActions from 'components/ui/FileActions';
import FileCard from 'components/FileCard';

type LessonDetailsScreenRouteProp = RouteProp<TeacherStackParamList, 'LessonDetailsScreen'>;

const LessonDetailsScreen = () => {
  const route = useRoute<LessonDetailsScreenRouteProp>();
  const { lesson } = route.params;

  const handleDownload = async (file: ILessonMaterial['file']) => {
    if (!file.url) return;

    try {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted) {
        Alert.alert('Permission denied', 'Cannot access storage');
        return;
      }

      const directoryUri = permissions.directoryUri;

      // Check existing files
      const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(directoryUri);

      const fileExists = files.some((uri) => uri.includes(file.fileName));
      const uniqueFileName = getUniqueFileName(file.fileName, files);

      const downloadFile = async () => {
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
          'This file already exists in the selected folder. Download again and replace it?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Download Again',
              onPress: downloadFile,
            },
          ]
        );
      } else {
        downloadFile();
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Download failed');
    }
  };

  // Reusable function to view file
  const handleView = (file: ILessonMaterial['file']) => {
    if (file.url) {
      Linking.openURL(file.url).catch(() => {
        Alert.alert('Error', 'Unable to open file.');
      });
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <Header title="Lesson Details" />

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="gap-8 px-4 py-5">
          <View className="gap-1">
            <Text className="text-3xl font-bold">{lesson.title}</Text>
            <Text className="font-medium text-gray-400">
              Last Updated: {dayjs(lesson.updatedAt).format('MMM DD, YYYY')}
            </Text>
          </View>

          <View>
            <Text className="mb-2 text-lg font-semibold uppercase tracking-widest text-slate-600">
              Lesson Materials
            </Text>

            {/* Materials Container */}
            {lesson.materials.length === 0 ? (
              <View className="items-center px-10 py-16">
                <Book size={48} color="#cbd5f5" />

                <Text className="mt-6 text-lg font-bold text-slate-700">No Lesson Materials</Text>

                <Text className="mt-2 text-center text-sm text-slate-500">
                  This lesson doesn't have any uploaded materials yet.
                </Text>
              </View>
            ) : (
              <View className="gap-2">
                {lesson.materials.map((material: ILessonMaterial) => (
                  <FileCard key={material.id} file={material.file} />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LessonDetailsScreen;
