import { Text } from 'components/ui/Text';
import useFetchData from 'hooks/useFetchData';
import useMutation from 'hooks/useMutation';
import { EllipsisVertical, MessageSquare, MinusCircle, Trash2, Users } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import Toast from 'react-native-toast-message';
import { ApiResponse } from 'types/common';
import { ClassStudentsDto } from 'types/user';
import { getErrorMessage } from 'utils/errorHandler';

const StudentTab = ({ classId }: { classId: string }) => {
  const { data, loading, error, refetchData } = useFetchData<ApiResponse<ClassStudentsDto>>(
    `class/${classId}/students`
  );
  const { execute } = useMutation();
  const [isUnenrolling, setIsUnenrolling] = useState(false);

  const handleUnenroll = async (studentId: string) => {
    if (isUnenrolling) return;
    setIsUnenrolling(true);

    try {
      const response: ApiResponse<void> = await execute(`class/${classId}/unenroll`, {
        method: 'POST',
        body: JSON.stringify({ studentId }),
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.message,
      });
      refetchData();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: getErrorMessage(error),
      });
    } finally {
      setIsUnenrolling(false);
    }
  };

  // TODO: Handle Error and refetch data

  const students = useMemo(() => {
    return data?.data?.students ?? [];
  }, [data]);

  return (
    <View className="gap-7">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold uppercase">Enrolled Students ({students.length})</Text>
      </View>

      {/* Empty State */}
      {!loading && students.length === 0 ? (
        <View className="items-center px-10 py-20">
          <Users size={48} color="#cbd5f5" />

          <Text className="mt-6 text-lg font-bold text-slate-700">No Students Yet</Text>

          <Text className="mt-2 text-center text-sm text-slate-500">
            There are no students enrolled in this class yet. Invite students with class code to
            start managing your class.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {students.map((student, idx) => (
            <View
              key={idx}
              className="flex-row items-center justify-between rounded-xl border border-slate-300 p-4">
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
                  <Text className="text-sm font-semibold" numberOfLines={1} ellipsizeMode="tail">
                    ID: {student.id}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-5">
                <Pressable>
                  <MessageSquare size={20} color="#90CF8E" />
                </Pressable>

                <Menu>
                  <MenuTrigger>
                    <EllipsisVertical size={20} />
                  </MenuTrigger>

                  <MenuOptions
                    customStyles={{
                      optionsContainer: {
                        width: 140,
                        borderRadius: 10,
                        paddingVertical: 2,
                        backgroundColor: 'white',
                      },
                    }}>
                    <MenuOption
                      customStyles={{
                        optionTouchable: {
                          activeOpacity: 0.6,
                        },
                      }}
                      onSelect={() => handleUnenroll(student.id)}>
                      <View className="flex-row items-center gap-2 p-2">
                        <MinusCircle size={16} color={'#ef4444'} />
                        <Text className="text-red-500">Unenroll</Text>
                      </View>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default StudentTab;
