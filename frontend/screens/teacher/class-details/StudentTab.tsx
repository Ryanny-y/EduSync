import { Text } from 'components/ui/Text';
import useFetchData from 'hooks/useFetchData';
import { EllipsisVertical, MessageSquare, Users } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';
import { ApiResponse } from 'types/common';
import { ClassStudentsDto } from 'types/user';

const StudentTab = ({ classId }: { classId: string }) => {
  const { data, loading, error, refetchData } = useFetchData<ApiResponse<ClassStudentsDto>>(
    `class/${classId}/students`
  );

  // TODO: Handle Error and refetch data

  const students = useMemo(() => {
    return data?.data?.students ?? [];
  }, [data]);

  return (
    <View className="gap-7">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold uppercase">
          Enrolled Students ({students.length})
        </Text>

        <Pressable>
          <Text className="font-semibold text-green-500">Add Student</Text>
        </Pressable>
      </View>

      {/* Empty State */}
      {!loading && students.length === 0 ? (
        <View className="items-center px-10 py-20">
          <Users size={48} color="#cbd5f5" />

          <Text className="mt-6 text-lg font-bold text-slate-700">
            No Students Yet
          </Text>

          <Text className="mt-2 text-center text-sm text-slate-500">
            There are no students enrolled in this class yet. Add students to
            start managing your class.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {students.map((student, idx) => (
            <View
              key={idx}
              className="flex-row items-center justify-between rounded-xl border border-slate-300 p-4"
            >
              <View className="flex-row items-center gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-green-500">
                  <Text className="font-semibold text-white">
                    {student.firstName?.[0]}
                    {student.lastName?.[0]}
                  </Text>
                </View>

                <View>
                  <Text className="text-xl font-bold text-slate-800">
                    {student.firstName} {student.lastName}
                  </Text>
                  <Text className="text-sm font-semibold">
                    ID: {student.id}
                  </Text>
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
      )}
    </View>
  );
};

export default StudentTab;