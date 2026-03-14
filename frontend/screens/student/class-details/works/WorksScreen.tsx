import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from 'components/Header';
import SubmissionStatusBadge from 'components/ui/SubmissionStatusBadge';
import { Text } from 'components/ui/Text';
import WorkTypeBadge from 'components/ui/WorkTypeBadge';
import dayjs from 'dayjs';
import useFetchData from 'hooks/useFetchData';
import { Calendar, ClipboardList, Clock } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ApiResponse } from 'types/common';
import { StudentStackParamList } from 'types/navigation';
import { IStudentWork, IWork } from 'types/work';

type NavigationProps = NativeStackNavigationProp<StudentStackParamList, 'WorkDetailsScreen'>;
type WorksScreenClassProp = RouteProp<StudentStackParamList, 'WorksScreen'>;

const WorksScreen = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<WorksScreenClassProp>();
  const { classId } = route.params;

  const { data, loading, error, refetchData } = useFetchData<ApiResponse<IStudentWork[]>>(
    `class/${classId}/works/my`
  );

  const works = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  if (!data || !data.data) return null;

  return (
    <View className="flex-1 bg-slate-50">
      <Header title="My Works" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        {!loading && works.length === 0 ? (
          <View className="items-center px-10 py-20">
            <ClipboardList size={48} color="#cbd5f5" />

            <Text className="mt-6 text-lg font-bold text-slate-700">No Works Yet</Text>

            <Text className="mt-2 text-center text-sm text-slate-500">
              Your teacher hasn't uploaded any works for this class yet.
            </Text>
          </View>
        ) : (
          <View className="gap-3 p-5">
            {works.map((work: IStudentWork) => {
              return (
                <Pressable
                  key={work.id}
                  className="gap-2 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                  {/* TOP */}
                  <View className="flex-1 flex-row items-center justify-between gap-3">
                    <WorkTypeBadge type={work.type} />
                    <SubmissionStatusBadge status={work.submissionStatus} />
                  </View>

                  {/* TITLES */}
                  <View>
                    <Text className="text-xl font-bold text-slate-600">{work.title}</Text>
                    {work?.description && (
                      <Text className="text-sm text-slate-600">
                        {work.description?.split(' ')[0]}
                      </Text>
                    )}
                  </View>

                  {/* Bottom */}
                  <View className="mt-1">
                    <View className="flex-row items-center gap-1">
                      <Calendar
                        size={14}
                        color={dayjs(work.dueDate).isSame(dayjs(), 'day') ? '#ef4444' : '#16a34a'}
                      />
                      {work.dueDate ? (
                        <Text
                          className={`text-sm font-medium ${
                            dayjs(work.dueDate).isSame(dayjs(), 'day')
                              ? 'text-red-500'
                              : 'text-slate-400'
                          }`}>
                          Due Date: {dayjs(work.dueDate).format('MMM D, YYYY')}
                        </Text>
                      ) : (
                        <Text className="text-sm font-medium text-slate-400">No Due Date</Text>
                      )}
                    </View>

                    <Pressable
                      className="mt-3 w-full rounded-xl bg-green-500 py-2"
                      onPress={() =>
                        navigation.navigate('WorkDetailsScreen', { classId, workId: work.id })
                      }>
                      <Text className="text-center text-white">View Details</Text>
                    </Pressable>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default WorksScreen;
