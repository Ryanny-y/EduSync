import { Text } from 'components/ui/Text';
import useFetchData from 'hooks/useFetchData';
import { BookOpen, Pencil, Plus, Trash2 } from 'lucide-react-native';
import { View } from 'react-native';
import { ApiResponse } from 'types/common';
import { LessonDto } from 'types/lesson';
import dayjs from 'dayjs';
import Pressable from 'components/ui/Pressable';
import React, { useMemo } from 'react';

const LessonTab = ({ classId }: { classId: string }) => {
  const { data, loading, error, refetchData } = useFetchData<ApiResponse<LessonDto[]>>(
    `class/${classId}/lessons`
  );

  const lessons = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  if(!data || !data.data) return null;

  return (
    <View className="gap-7">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold uppercase">
          Lessons ({lessons.length})
        </Text>

        <Pressable className='bg-green-500 p-2.5 rounded-xl'>
          <Plus size={20} color="#ffffff"/>
        </Pressable>
      </View>

      {/* Empty State */}
      {!loading && lessons.length === 0 ? (
        <View className="items-center px-10 py-20">
          <BookOpen size={48} color="#cbd5f5" />

          <Text className="mt-6 text-lg font-bold text-slate-700">
            No Lessons Yet
          </Text>

          <Text className="mt-2 text-center text-sm text-slate-500">
            You haven't uploaded any lessons yet. Start adding learning
            materials so your students can access them anytime.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {lessons.map((lesson, idx) => (
            <View
              key={idx}
              className="flex-row items-center justify-between rounded-xl border border-slate-300 p-5"
            >
              {/* LEFT SIDE */}
              <View className="flex-row items-center gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <BookOpen color="#90CF8E" />
                </View>

                <View>
                  <Text className="text-xl font-bold text-slate-800">
                    {lesson.title}
                  </Text>

                  <Text className="text-xs font-semibold text-slate-500">
                    UPLOADED: {dayjs(lesson.createdAt).format("MMM DD, YYYY")}
                  </Text>
                </View>
              </View>

              {/* ACTIONS */}
              <View className="flex-row items-center gap-5">
                <Pressable>
                  <Pencil size={20} strokeWidth={2.5} color="#90CF8E" />
                </Pressable>

                <Pressable>
                  <Trash2 size={20} color="#ef4444" />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default LessonTab;