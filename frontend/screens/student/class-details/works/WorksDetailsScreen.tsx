import { RouteProp, useRoute } from '@react-navigation/native';
import FileCard from 'components/FileCard';
import Header from 'components/Header';
import SubmissionStatusBadge from 'components/ui/SubmissionStatusBadge';
import { Text } from 'components/ui/Text';
import WorkTypeBadge from 'components/ui/WorkTypeBadge';
import dayjs from 'dayjs';
import useFetchData from 'hooks/useFetchData';
import { Clock } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { ApiResponse } from 'types/common';
import { StudentStackParamList } from 'types/navigation';
import { IWork } from 'types/work';
import { ISubmission } from 'types/submission';
import SubmissionBox from './SubmissionBox';

type WorkDetailsRouteProp = RouteProp<StudentStackParamList, 'WorkDetailsScreen'>;

const WorkDetailsScreen = () => {
  const route = useRoute<WorkDetailsRouteProp>();
  const { classId, workId } = route.params;

  // TODO: HANDLE LOADING AND ERROR
  const {
    data: workData,
    loading: workLoading,
    error: workError,
  } = useFetchData<ApiResponse<IWork>>(`class/${classId}/works/${workId}`);

  // TODO: HANDLE LOADING AND ERROR
  const {
    data: submissionData,
    loading: submissionLoading,
    error: submissionError,
    refetchData: refetchSubmission,
  } = useFetchData<ApiResponse<ISubmission>>(`class/${classId}/works/${workId}/submissions/my`);

  if (workLoading || submissionLoading) return <Text>Loading...</Text>;
  if (workError) return <Text>Error loading work details</Text>;
  if (submissionError) return <Text>Error loading submission</Text>;
  if (!workData?.data || !submissionData?.data) return <Text>No data available</Text>;

  const work = workData.data;
  const submission = submissionData.data;

  return (
    <View className="flex-1">
      <Header title="Work Details" />

      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="flex-1 px-5">
          {/* Work Details */}
          <View className="mb-5 items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <View className="w-full flex-row items-center justify-between">
              <WorkTypeBadge type={work.type} />
              <SubmissionStatusBadge status={submission.status} />
            </View>

            <View className="mt-2 w-full gap-2">
              <Text className="text-2xl font-bold">{work.title}</Text>
              <View className="w-full flex-row items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
                <Clock
                  size={16}
                  color={dayjs(work.dueDate).isSame(dayjs(), 'day') ? '#ef4444' : '#16a34a'}
                />
                {work.dueDate ? (
                  <Text
                    className={`font-semibold ${
                      dayjs(work.dueDate).isSame(dayjs(), 'day') ? 'text-red-500' : 'text-slate-500'
                    }`}>
                    Deadline: {dayjs(work.dueDate).format('MMM D, YYYY')}
                  </Text>
                ) : (
                  <Text className="font-semibold text-slate-500 text-sm">No Due Date</Text>
                )}
              </View>
            </View>
          </View>

          {work.description && (
            <View className="mb-5 gap-2">
              <Text className="text-sm font-semibold uppercase text-slate-500">Instructions</Text>
              <View className="items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <Text>{work.description}</Text>
              </View>
            </View>
          )}

          {/* Attached Materials */}
          <View className="gap-2">
            <Text className="text-sm font-semibold uppercase text-slate-500">
              Attached Materials
            </Text>
            <View className="mb-8 gap-2">
              {work.materials.map((material) => (
                <FileCard key={material.id} file={material.file} />
              ))}
            </View>
          </View>

          {/* Submission Box */}
          <SubmissionBox
            classId={classId}
            workId={workId}
            dueDate={work.dueDate}
            submission={submission}
            refetchSubmission={refetchSubmission}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkDetailsScreen;
