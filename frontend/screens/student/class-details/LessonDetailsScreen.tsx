import { RouteProp, useRoute } from '@react-navigation/native';
import Header from 'components/Header';
import { Text } from 'components/ui/Text';
import dayjs from 'dayjs';
import { Book } from 'lucide-react-native';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { ILessonMaterial } from 'types/lesson';
import { TeacherStackParamList } from 'types/navigation';
import FileCard from 'components/FileCard';

type LessonDetailsScreenRouteProp = RouteProp<TeacherStackParamList, 'LessonDetailsScreen'>;

const LessonDetailsScreen = () => {
  const route = useRoute<LessonDetailsScreenRouteProp>();
  const { lesson } = route.params;

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
