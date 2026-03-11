import { Text } from 'components/ui/Text';
import useFetchData from 'hooks/useFetchData';
import { EllipsisVertical, MessageSquare } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';
import { ClassStudentsDto } from 'types/user';

const StudentTab = ({ classId, isActive }: { classId: string; isActive: boolean }) => {
  if (!isActive) return null;

  const { data, loading, error } = useFetchData<ClassStudentsDto>(`class/${classId}/students`);
  console.log(data);

  return (
    <View className="gap-7">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold uppercase">Enrolled Students (5)</Text>
        <Pressable>
          <Text className="font-semibold text-green-500">Add Student</Text>
        </Pressable>
      </View>

      <View className="gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <View
            key={idx}
            className="flex-row items-center justify-between rounded-xl border border-slate-300 p-4">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-green-500">
                <Text className="font-semibold text-white">JD</Text>
              </View>
              <View>
                <Text className="text-xl font-bold text-slate-800">Juan Dela Cruz</Text>
                <Text className="text-sm font-semibold">ID: 24-1367</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-5">
              <Pressable>
                <MessageSquare size={20} color="#90CF8E" />
              </Pressable>
              <Pressable>
                <EllipsisVertical size={20} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default StudentTab;
