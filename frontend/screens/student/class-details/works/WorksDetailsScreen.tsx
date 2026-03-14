import { RouteProp, useRoute } from '@react-navigation/native';
import FileCard from 'components/FileCard';
import Header from 'components/Header';
import FileUploader from 'components/ui/FileUploader';
import Pressable from 'components/ui/Pressable';
import SubmissionStatusBadge from 'components/ui/SubmissionStatusBadge';
import { Text } from 'components/ui/Text';
import WorkTypeBadge from 'components/ui/WorkTypeBadge';
import dayjs from 'dayjs';
import useFetchData from 'hooks/useFetchData';
import { CheckCircle, Clock } from 'lucide-react-native';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { ApiResponse } from 'types/common';
import { StudentStackParamList } from 'types/navigation';
import { ISubmission } from 'types/submission';
import { IWorkMaterial } from 'types/work';

type WorkDetailsRouteProp = RouteProp<StudentStackParamList, 'WorkDetailsScreen'>;

const WorkDetailsScreen = () => {
  const route = useRoute<WorkDetailsRouteProp>();
  const { work } = route.params;

  // TODO: Handle Loading and Error State
  const { data, loading, error, refetchData } = useFetchData<ApiResponse<ISubmission>>(
    `class/${work.classId}/works/${work.id}/submissions/my`
  );

  if (!data?.data || !data) return null;

  const submission = data.data;

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

            <View className="w-full gap-2">
              <Text className="text-2xl font-bold">{work.title}</Text>
              <View className="w-full flex-row items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
                <Clock
                  size={16}
                  color={dayjs(work.dueDate).isSame(dayjs(), 'day') ? '#ef4444' : '#16a34a'}
                />

                <Text
                  className={`font-semibold ${
                    dayjs(work.dueDate).isSame(dayjs(), 'day') ? 'text-red-500' : 'text-slate-500'
                  }`}>
                  Deadline: {dayjs(work.dueDate).format('MMM D, YYYY')}
                </Text>
              </View>
            </View>
          </View>

          {work.description && (
            <View className="mb-5 gap-2 ">
              <Text className="text-sm font-semibold uppercase text-slate-500">Instructions</Text>
              <View className="items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <Text className="">{work.description}</Text>
              </View>
            </View>
          )}

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

          {/* Submission Box */}
          <View className="gap-2">
            <Text className="text-sm font-semibold uppercase text-slate-500">Submission</Text>

            <FileUploader
              title="Upload your work"
              onFilesSelected={
                (files) => {}
                // setFormData((prev) => ({
                //   ...prev,
                //   materials: [...(prev.materials ?? []), ...files],
                // }))
              }
              showButton
            />

            <Pressable className="mt-4 flex-row items-center justify-center gap-2 rounded-3xl bg-green-500 py-5">
              <CheckCircle size={20} color="#fff" />
              <Text className="text-white">Submit Work</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkDetailsScreen;
