import { Text } from 'components/ui/Text';
import useFetchData from 'hooks/useFetchData';
import { BookOpen, Eye, Pencil, Plus, Trash2 } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { ApiResponse } from 'types/common';
import { ILesson } from 'types/lesson';
import dayjs from 'dayjs';
import Pressable from 'components/ui/Pressable';
import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TeacherStackParamList } from 'types/navigation';
import DeleteConfirmationModal from 'components/DeleteConfirmationModal';
import useMutation from 'hooks/useMutation';
import Toast from 'react-native-toast-message';
import { getErrorMessage } from 'utils/errorHandler';

type NavigationProps = NativeStackNavigationProp<TeacherStackParamList, 'AddLessonScreen'>;

const LessonTab = ({ classId }: { classId: string }) => {
  const navigation = useNavigation<NavigationProps>();
  const { execute } = useMutation();
  const { data, loading, error, refetchData } = useFetchData<ApiResponse<ILesson[]>>(
    `class/${classId}/lessons`
  );

  useFocusEffect(
    useCallback(() => {
      refetchData();
    }, [])
  );

  const lessons = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<ILesson | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!selectedLesson || isDeleting) return;

    setIsDeleting(true);

    try {
      const response: ApiResponse<void> = await execute(
        `class/${classId}/lessons/${selectedLesson.id}`,
        { method: 'DELETE' }
      );

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.message,
      });

      setDeleteModalVisible(false);
      setSelectedLesson(null);

      refetchData();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: getErrorMessage(error),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!data || !data.data) return null;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="gap-7">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold uppercase">Lessons ({lessons.length})</Text>

          <Pressable
            className="rounded-xl bg-green-500 p-2.5"
            onPress={() => navigation.navigate('AddLessonScreen', { classId })}>
            <Plus size={20} color="#ffffff" />
          </Pressable>
        </View>

        {/* Empty State */}
        {!loading && lessons.length === 0 ? (
          <View className="items-center px-10 py-20">
            <BookOpen size={48} color="#cbd5f5" />

            <Text className="mt-6 text-lg font-bold text-slate-700">No Lessons Yet</Text>

            <Text className="mt-2 text-center text-sm text-slate-500">
              You haven't uploaded any lessons yet. Start adding learning materials so your students
              can access them anytime.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {lessons.map((lesson) => (
              <Pressable 
                onPress={() => navigation.navigate('LessonDetailsScreen', { lesson })}
                key={lesson.id}
                className="flex-row items-center justify-between rounded-xl border border-slate-300 px-5 py-3">
                {/* LEFT SIDE */}
                <View className="flex-row items-center gap-3">
                  <View className="h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                    <BookOpen color="#90CF8E" />
                  </View>

                  <View>
                    <Text className="text-xl font-bold text-slate-800">{lesson.title}</Text>

                    <Text className="text-xs font-semibold text-slate-500">
                      UPLOADED: {dayjs(lesson.createdAt).format('MMM DD, YYYY')}
                    </Text>
                  </View>
                </View>

                {/* ACTIONS */}
                <View className="flex-row items-center gap-5">
                  <Pressable
                    onPress={() => {
                      setSelectedLesson(lesson);
                      setDeleteModalVisible(true);
                    }}>
                    <Trash2 size={20} color="#ef4444" />
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        <DeleteConfirmationModal
          visible={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={handleConfirmDelete}
          title={selectedLesson?.title ?? ''}
          loading={isDeleting}
        />
      </View>
    </ScrollView>
  );
};

export default LessonTab;
