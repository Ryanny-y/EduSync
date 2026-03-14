import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import FileCard from 'components/FileCard';
import Header from 'components/Header';
import Pressable from 'components/ui/Pressable';
import SubmissionStatusBadge from 'components/ui/SubmissionStatusBadge';
import { Text } from 'components/ui/Text';
import WorkTypeBadge from 'components/ui/WorkTypeBadge';
import dayjs from 'dayjs';
import useFetchData from 'hooks/useFetchData';
import { Calendar, ChevronRight } from 'lucide-react-native';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ApiResponse } from 'types/common';
import { TeacherStackParamList } from 'types/navigation';
import {
  ISubmission,
  ISubmissionList,
  SubmissionStatus,
  SubmissionStatusTypes,
} from 'types/submission';
import { IWorkMaterial } from 'types/work';

type WorkDetailsRouteProp = RouteProp<TeacherStackParamList, 'WorkDetailsScreen'>;

const WorkDetailsScreen = () => {
  const route = useRoute<WorkDetailsRouteProp>();
  const { work } = route.params;

  const filters: (SubmissionStatus | 'ALL')[] = ['ALL', ...SubmissionStatusTypes];
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | 'ALL'>('ALL');

  // Fetch submissions
  const { data, loading, error, refetchData } = useFetchData<ApiResponse<ISubmissionList>>(
    `class/${work.classId}/works/${work.id}/submissions?status=${filterStatus}`
  );

  useFocusEffect(
    useCallback(() => {
      refetchData();
    }, [])
  );

  const submissionsData = useMemo(() => {
    return (
      data?.data ?? {
        submissions: [],
        stats: {
          total: 0,
          pending: 0,
          submitted: 0,
          graded: 0,
          late: 0,
          missing: 0,
        },
      }
    );
  }, [data]);

  return (
    <View className="flex-1">
      <Header title="Work Details" />

      <ScrollView showsHorizontalScrollIndicator={false}>
        <View className="flex-1 px-5">
          {/* Work Details */}
          <View className="mb-8 items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <WorkTypeBadge type={work.type} />
            <Text className="text-2xl font-bold">{work.title}</Text>
            <View className="flex-row items-center gap-1">
              <Calendar
                size={14}
                color={dayjs(work.dueDate).isSame(dayjs(), 'day') ? '#ef4444' : '#64748b'}
              />

              <Text
                className={`text-sm font-semibold ${
                  dayjs(work.dueDate).isSame(dayjs(), 'day') ? 'text-red-500' : 'text-slate-500'
                }`}>
                Due: {dayjs(work.dueDate).format('MMM D, YYYY')}
              </Text>
            </View>

            <View className="mb-5 mt-4 gap-2">
              <Text className="text-slate-xs text-sm font-semibold uppercase text-slate-500">
                Description
              </Text>
              <Text className="">{work.description}</Text>
            </View>

            <View className="flex-row items-center gap-5">
              <View className="items-ce flex-1">
                <Text className="text-sm font-semibold uppercase text-slate-400">Submitted</Text>
                <Text className="text-xl font-bold text-green-600">
                  {submissionsData.stats.submitted}
                </Text>
              </View>
              <View className="items-ce flex-1">
                <Text className="text-sm font-semibold uppercase text-slate-400">Missing</Text>
                <Text className="text-xl font-bold text-red-500">
                  {submissionsData.stats.missing}
                </Text>
              </View>
              <View className="items-ce flex-1">
                <Text className="text-sm font-semibold uppercase text-slate-400">Total</Text>
                <Text className="text-xl font-bold">{submissionsData.stats.total}</Text>
              </View>
            </View>
          </View>

          {/* ATTACHED MATERIALS */}
          <View className="gap-2">
            <Text className="text-sm font-semibold uppercase text-slate-500">
              Attached Materials
            </Text>

            <View className="mb-8 gap-2">
              {work.materials.map((material: IWorkMaterial) => (
                <FileCard key={material.id} file={material.file} />
              ))}
            </View>
          </View>

          {/* Submissions */}
          <View className="gap-2">
            <Text className="text-sm font-semibold uppercase text-slate-500">
              Submission ({submissionsData.stats.total})
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              className="grow-0 rounded-2xl border-b border-slate-100 bg-white py-3">
              {filters.map((filter) => {
                return (
                  <Pressable
                    key={filter}
                    onPress={() => {
                      setFilterStatus(filter);
                    }}
                    className={`relative mr-2 gap-2 px-5 py-2 ${filterStatus === filter ? 'bg-green-500' : 'bg-transparent'} rounded-2xl`}>
                    <Text
                      className={`text-sm font-bold ${filterStatus === filter ? 'text-white' : 'text-slate-400'}`}>
                      {filter}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View className="mb-8 gap-2">
              {submissionsData.submissions.map((submission: ISubmission) => (
                <Pressable
                  key={submission.id}
                  className="flex-row items-center gap-5 rounded-xl border border-slate-500/20 bg-white p-5">
                  <View className="h-12 w-12 items-center justify-center rounded-xl bg-green-500">
                    <Text className="font-semibold text-white">
                      {submission.studentName.split(' ')?.[0][0]}
                      {submission.studentName.split(' ')?.[1][0]}
                    </Text>
                  </View>

                  <View className="flex-1 items-start gap-1">
                    <Text className="text-lg font-semibold">{submission.studentName}</Text>
                    <Text className="text-[10px] font-medium uppercase text-slate-500">
                      {submission.turnedInAt
                        ? `Submitted: ${dayjs(submission.turnedInAt).format('MMM DD - h:mm A')}`
                        : 'No Submission'}
                    </Text>
                    <SubmissionStatusBadge status={submission.status} />
                  </View>

                  {submission?.grade ? (
                    <View className="rounded-xl bg-green-100 px-4 py-2">
                      <Text className="text-sm font-semibold text-green-600">
                        {submission.grade}/100
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <ChevronRight color="#cbd5e1" className="text-slate-300" />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkDetailsScreen;
