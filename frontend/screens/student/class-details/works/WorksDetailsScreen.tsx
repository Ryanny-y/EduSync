import { RouteProp, useRoute } from '@react-navigation/native';
import FileCard from 'components/FileCard';
import Header from 'components/Header';
import FileList from 'components/ui/FileList';
import FileUploader from 'components/ui/FileUploader';
import Pressable from 'components/ui/Pressable';
import SubmissionStatusBadge from 'components/ui/SubmissionStatusBadge';
import { Text } from 'components/ui/Text';
import WorkTypeBadge from 'components/ui/WorkTypeBadge';
import dayjs from 'dayjs';
import useFetchData from 'hooks/useFetchData';
import useMutation from 'hooks/useMutation';
import { CheckCircle, Clock } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { ApiResponse, IFile, IUploadFile } from 'types/common';
import { StudentStackParamList } from 'types/navigation';
import { ISubmission } from 'types/submission';
import { IWorkMaterial } from 'types/work';
import { getErrorMessage } from 'utils/errorHandler';

type WorkDetailsRouteProp = RouteProp<StudentStackParamList, 'WorkDetailsScreen'>;

const WorkDetailsScreen = () => {
  const route = useRoute<WorkDetailsRouteProp>();
  const { execute } = useMutation();
  const { work } = route.params;

  // TODO: Handle Loading and Error State
  const { data, loading, error, refetchData } = useFetchData<ApiResponse<ISubmission>>(
    `class/${work.classId}/works/${work.id}/submissions/my`
  );

  const [uploading, setUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!data?.data || !data) return null;

  const submission = data.data;

  const now = new Date();
  const dueDate = work.dueDate ? new Date(work.dueDate) : null;

  const canSubmit =
    submission.status === 'PENDING' || submission.status === 'LATE'
      ? !dueDate || now <= dueDate
      : false;

  const canUnsubmit =
    submission.turnedInAt && submission.status !== 'GRADED' && (!dueDate || now <= dueDate);

  const handleFilesSelected = async (files: IUploadFile[]) => {
    if (uploading) return;
    if (!files.length) return;

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file as any));

      const response: ApiResponse<ISubmission> = await execute(
        `class/${work.classId}/works/${work.id}/submissions/${submission.id}/files`,
        {
          method: 'POST',
          body: formData,
        }
      );

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'File uploaded',
      });
      refetchData?.(); // Refresh submission
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'error',
        text2: getErrorMessage(err),
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (file: IFile) => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const response: ApiResponse<ISubmission> = await execute(
        `class/${work.classId}/works/${work.id}/submissions/${submission.id}/files`,
        {
          method: 'DELETE',
          body: JSON.stringify({ filesToDelete: [file.id] }),
        }
      );
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.message,
      });
      refetchData?.();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'error',
        text2: getErrorMessage(err),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response: ApiResponse<ISubmission> = await execute(
        `class/${work.classId}/works/${work.id}/submissions/${submission.id}/turn-in`,
        {
          method: 'POST',
        }
      );

      console.log(response);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.message,
      });
      refetchData?.();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'error',
        text2: getErrorMessage(err),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

            {canSubmit && (
              <FileUploader
                title="Upload your work"
                onFilesSelected={handleFilesSelected}
                showButton
              />
            )}

            {submission.files?.length > 0 && (
              <FileList
                files={submission.files.map((f) => f.file)}
                onRemove={(file) => {
                  if ('id' in file) {
                    handleFileDelete(file);
                  }
                }}
              />
            )}

            {canSubmit && (
              <Pressable
                className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl bg-green-500 py-4"
                onPress={handleSubmit}>
                <CheckCircle size={20} color="#fff" />
                <Text className="text-white">Submit Work</Text>
              </Pressable>
            )}

            {canUnsubmit && (
              <Pressable
                className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl bg-green-500 py-4"
                onPress={handleSubmit}>
                <CheckCircle size={20} color="#fff" />
                <Text className="text-white">Unsubmit</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkDetailsScreen;
