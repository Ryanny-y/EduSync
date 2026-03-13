import React from 'react';
import { ScrollView, View } from 'react-native';
import ClassDetailHeader from './class-details/ClassDetailsHeader';
import useFetchData from 'hooks/useFetchData';
import { ApiResponse } from 'types/common';
import { IClass } from 'types/class';
import { StudentStackParamList } from 'types/navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Text } from 'components/ui/Text';
import { BookOpen, ChevronRight, FileText } from 'lucide-react-native';
import Pressable from 'components/ui/Pressable';

type EditClassProp = RouteProp<StudentStackParamList, 'ClassDetailsScreen'>;

const ClassDetailsScreen = () => {
  const route = useRoute<EditClassProp>();
  const { classId } = route.params;

  // TODO: Handle Loading and error state
  const { data, loading, error } = useFetchData<ApiResponse<IClass>>(`class/${classId}`);

  if (!data || !data.data) return;

  return (
    <View className="w-full flex-1 items-center justify-start bg-background">
      <ClassDetailHeader item={data.data} />

      {/* ClassRoom Activities */}
      <View className="w-full flex-1 px-5 pt-10">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}>
          <Text className="mb-5 text-2xl font-bold text-slate-700">Classroom Activties</Text>

          <View className="gap-3">
            {/* LESSON */}
            <Pressable className="flex-row items-center gap-5 rounded-xl border border-slate-200/50 bg-white p-5">
              {/* RIGHT SIDE */}
              <View className="rounded-xl bg-indigo-50 p-4">
                <BookOpen color={'#6366f1'} />
              </View>
              {/* CENTER */}
              <View className="flex-1">
                <Text className="text-xl font-semibold text-slate-600">Lesson</Text>
                <Text className="text-sm font-medium text-slate-400">
                  View study materials & videos
                </Text>
              </View>
              {/* LEFT */}
              <View className="rounded-xl bg-slate-50 p-4">
                <ChevronRight color={'#94a3b8'} />
              </View>
            </Pressable>

            {/* Works */}
            <Pressable className="flex-row items-center gap-5 rounded-xl border border-slate-200/50 bg-white p-5">
              {/* RIGHT SIDE */}
              <View className="rounded-xl bg-green-50 p-4 text-green-600">
                <FileText color={'#16a34a'} />
              </View>
              {/* CENTER */}
              <View className="flex-1">
                <Text className="text-xl font-semibold text-slate-600">Works</Text>
                <Text className="text-sm font-medium text-slate-400">
                  Assignment, Activities & Quiz
                </Text>
              </View>
              {/* LEFT */}
              <View className="rounded-xl bg-slate-50 p-4">
                <ChevronRight color={'#94a3b8'} />
              </View>
            </Pressable>

            {/* Message */}
            <Pressable className="flex-row items-center gap-5 rounded-xl border border-slate-200/50 bg-white p-5">
              {/* RIGHT SIDE */}
              <View className="rounded-xl bg-red-50 p-4 text-red-600">
                <FileText color={'#dc2626'} />
              </View>
              {/* CENTER */}
              <View className="flex-1">
                <Text className="text-xl font-semibold text-slate-600">Messages</Text>
                <Text className="text-sm font-medium text-slate-400">Chat with Teacher</Text>
              </View>
              {/* LEFT */}
              <View className="rounded-xl bg-slate-50 p-4">
                <ChevronRight color={'#94a3b8'} />
              </View>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ClassDetailsScreen;
