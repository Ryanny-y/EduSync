import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from 'components/Header';
import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import dayjs from 'dayjs';
import useFetchData from 'hooks/useFetchData';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { ApiResponse } from 'types/common';
import { ILesson } from 'types/lesson';
import { StudentStackParamList } from 'types/navigation';
import { getFileIcon } from 'utils/helpers';

type NavigationProps = NativeStackNavigationProp<StudentStackParamList, 'LessonDetailsScreen'>;
type LessonsScreenClassProp = RouteProp<StudentStackParamList, 'LessonsScreen'>;

const LessonsScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<LessonsScreenClassProp>();
  const { classId } = route.params;

  // TODO: HANDLE LOADING AND ERROR
  const { data, loading, error, refetchData } = useFetchData<ApiResponse<ILesson[]>>(
    `class/${classId}/lessons`
  );

  const lessons = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  return (
    <View className="flex-1 bg-slate-50">
      <Header title="Lessons" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        {!loading && lessons.length === 0 ? (
          <View className="items-center px-10 py-20">
            <BookOpen size={48} color="#cbd5f5" />

            <Text className="mt-6 text-lg font-bold text-slate-700">No Lessons Yet</Text>

            <Text className="mt-2 text-center text-sm text-slate-500">
              Your teacher hasn't uploaded any lessons for this class yet.
            </Text>
          </View>
        ) : (
          <View className="gap-3 p-5">
            {lessons.map((lesson: ILesson) => {
              const FileIcon = getFileIcon(lesson.materials[0]?.file?.fileName);
              return (
                <Pressable
                  key={lesson.id}
                  onPress={() => navigation.navigate('LessonDetailsScreen', { lesson })}
                  className="flex-row items-center justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  <View className="flex-1 flex-row items-center gap-3">
                    {/* Icon */}
                    <View className="h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                      <FileIcon size={20} color="#6366f1" />
                    </View>

                    {/* Lesson Info */}
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-slate-800">{lesson.title}</Text>

                      <Text className="mt-1 text-xs text-slate-500">
                        Uploaded {dayjs(lesson.createdAt).format('MMM DD, YYYY')}
                      </Text>
                    </View>
                  </View>

                  {/* Arrow */}
                  <ChevronRight size={20} color="#94a3b8" />
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default LessonsScreen;
