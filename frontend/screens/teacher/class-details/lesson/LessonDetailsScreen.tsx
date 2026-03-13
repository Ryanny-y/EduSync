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
                {lesson.materials.map((material: ILessonMaterial) => {
                  const { file } = material;
                  const IconComponent = getFileIcon(file.fileName);

                  return (
                    <View
                      key={material.id}
                      className="flex-row items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      {/* File Info Section */}
                      <View className="flex-1 flex-row items-center gap-3">
                        <View className="h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                          <IconComponent size={20} color="#4B5563" />
                        </View>

                        <View className="flex-1">
                          <Text
                            className="text-base font-semibold text-slate-800"
                            numberOfLines={2}>
                            {file.fileName}
                          </Text>

                          <View className="mt-1 flex-row items-center justify-between">
                            <View className="rounded-full bg-slate-100 px-2 py-1">
                              <Text className="text-xs font-medium uppercase text-slate-500">
                                {file.fileType}
                              </Text>
                            </View>

                            <Text className="text-xs text-gray-400">
                              {dayjs(file.createdAt).format('MMM DD, YYYY')}
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Action Buttons */}
                      <View className="ml-5 flex-row items-center gap-2">
                        <Pressable
                          onPress={() => handleView(file)}
                          className="rounded-lg bg-blue-100 px-3 py-3 active:opacity-70">
                          <Eye size={16} color="#2563EB" />
                        </Pressable>

                        <Pressable
                          onPress={() => handleDownload(file)}
                          className="rounded-lg bg-green-100 px-3 py-3 active:opacity-70">
                          <Download size={16} color="#16A34A" />
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LessonDetailsScreen;
