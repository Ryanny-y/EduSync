import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import WorkTypeBadge from 'components/ui/WorkTypeBadge';
import dayjs from 'dayjs';
import useFetchData from 'hooks/useFetchData';
import useMutation from 'hooks/useMutation';
import { Calendar, ClipboardList, Edit, EllipsisVertical, Eye, Trash2 } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { ApiResponse } from 'types/common';
import { TeacherStackParamList } from 'types/navigation';
import { IWork } from 'types/work';

type NavigationProps = NativeStackNavigationProp<TeacherStackParamList, 'CreateWorkScreen'>;

const WorksTab = ({ classId }: { classId: string }) => {
  const navigation = useNavigation<NavigationProps>();
  const { execute } = useMutation();
  const { data, loading, error, refetchData } = useFetchData<ApiResponse<IWork[]>>(
    `class/${classId}/works`
  );

  useFocusEffect(
    useCallback(() => {
      refetchData();
    }, [])
  );

  const works = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  if (!data || !data.data) return null;

  return (
    <ScrollView showsHorizontalScrollIndicator={false}>
      <View className="gap-7">
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold uppercase">Works</Text>

          <Pressable
            className="p-2.5"
            onPress={() => navigation.navigate('CreateWorkScreen', { classId })}>
            <Text className="font-bold tracking-wide text-green-500">Create Work</Text>
          </Pressable>
        </View>

        {!loading && works.length === 0 ? (
          <View className="items-center px-10 py-20">
            <ClipboardList size={48} color="#cbd5f5" />

            <Text className="mt-6 text-lg font-bold text-slate-700">No Works Yet</Text>

            <Text className="mt-2 text-center text-sm text-slate-500">
              You haven't created any works for this class yet. Add assignments, quizzes, or
              activities so students can start working on them.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {works.map((work: IWork) => (
              <View key={work.id} className="gap-2 rounded-xl border border-slate-300 p-5">
                {/* HEADER */}
                <View className="w-full flex-row items-center justify-between">
                  <WorkTypeBadge type={work.type} />

                  <View className="flex-row items-center gap-1">
                    <Calendar
                      size={14}
                      color={dayjs(work.dueDate).isSame(dayjs(), 'day') ? '#ef4444' : '#16a34a'}
                    />

                    <Text
                      className={`text-sm font-semibold ${
                        dayjs(work.dueDate).isSame(dayjs(), 'day')
                          ? 'text-red-500'
                          : 'text-slate-500'
                      }`}>
                      Due: {dayjs(work.dueDate).format('MMM D, YYYY')}
                    </Text>
                  </View>
                </View>

                {/* BODY */}
                <View className="flex-row items-center justify-between gap-2">
                  {/* LEFT SIDE HEADER */}
                  <View className="flex-1 items-start gap-1">
                    <Text className="flex-1 text-lg font-semibold leading-6" numberOfLines={2}>
                      {work.title}
                    </Text>
                  </View>

                  {/* RIGHT SIDE HEADER */}
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
                        // onSelect={() =>
                        //   // navigation.navigate('EditClassScreen', { classData: item })
                        // }
                      >
                        <View className="flex-row items-center gap-2 p-2">
                          <Edit size={16} />
                          <Text>Edit</Text>
                        </View>
                      </MenuOption>

                      <MenuOption
                        customStyles={{
                          optionTouchable: {
                            activeOpacity: 0.6,
                          },
                        }}
                        onSelect={() => {
                          // setDeleteModalVisible(true);
                        }}>
                        <View className="flex-row items-center gap-2 p-2">
                          <Trash2 size={16} color={'#ef4444'} />
                          <Text className="text-red-500">Delete</Text>
                        </View>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                </View>

                {/* BOTTOM */}
                <View className="mt-2">
                  <Pressable
                    className="flex items-center rounded-xl bg-green-500 p-2 text-center"
                    onPress={() => navigation.navigate('WorkDetailsScreen', { work })}>
                    <Text className="text-white">
                      View {`${work.type[0]}${work.type.slice(1).toLowerCase()}`}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default WorksTab;
