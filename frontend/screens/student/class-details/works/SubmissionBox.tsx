import { useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import FileList from 'components/ui/FileList';
import FileUploader from 'components/ui/FileUploader';
import Pressable from 'components/ui/Pressable';
import { CheckCircle } from 'lucide-react-native';
import { Text } from 'components/ui/Text';
import useMutation from 'hooks/useMutation';
import { ApiResponse, IFile, IUploadFile } from 'types/common';
import { ISubmission } from 'types/submission';
import { getErrorMessage } from 'utils/errorHandler';

interface SubmissionBoxProps {
  classId: string;
  workId: string;
  dueDate?: string | null;
  submission: ISubmission;
  refetchSubmission?: () => void;
}

const SubmissionBox = ({
  classId,
  workId,
  dueDate,
  submission,
  refetchSubmission,
}: SubmissionBoxProps) => {
  const { execute } = useMutation();

  const [uploading, setUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const now = new Date();
  const due = dueDate ? new Date(dueDate) : null;

  const canSubmit =
    submission.status === 'PENDING' || submission.status === 'LATE' ? !due || now <= due : false;

  const canUnsubmit =
    submission.turnedInAt && submission.status !== 'GRADED' && (!due || now <= due);

  const handleFilesSelected = async (files: IUploadFile[]) => {
    if (uploading || !files.length) return;
    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file as any));

      await execute(`class/${classId}/works/${workId}/submissions/${submission.id}/files`, {
        method: 'POST',
        body: formData,
      });

      Toast.show({ type: 'success', text1: 'Success', text2: 'File uploaded' });
      refetchSubmission?.();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: getErrorMessage(err) });
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (file: IFile) => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const response: ApiResponse<ISubmission> = await execute(
        `class/${classId}/works/${workId}/submissions/${submission.id}/files`,
        { method: 'DELETE', body: JSON.stringify({ filesToDelete: [file.id] }) }
      );
      Toast.show({ type: 'success', text1: 'Success', text2: response.message });
      refetchSubmission?.();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: getErrorMessage(err) });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response: ApiResponse<ISubmission> = await execute(
        `class/${classId}/works/${workId}/submissions/${submission.id}/turn-in`,
        { method: 'POST' }
      );
      Toast.show({ type: 'success', text1: 'Success', text2: response.message });
      refetchSubmission?.();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: getErrorMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response: ApiResponse<ISubmission> = await execute(
        `class/${classId}/works/${workId}/submissions/${submission.id}/unsubmit`,
        { method: 'POST' }
      );
      Toast.show({ type: 'success', text1: 'Success', text2: response.message });
      refetchSubmission?.();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Error', text2: getErrorMessage(err) });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold uppercase text-slate-500">SUBMISSIONS</Text>

      {canSubmit && (
        <FileUploader title="Upload your work" onFilesSelected={handleFilesSelected} showButton />
      )}

      {submission.files?.length > 0 && (
        <FileList
          files={submission.files.map((f) => f.file)}
          onRemove={(file) => {
            if ('id' in file) handleFileDelete(file);
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
          className="mt-4 flex-row items-center justify-center gap-2 rounded-2xl bg-gray-400 py-4"
          onPress={handleUnsubmit}>
          <CheckCircle size={20} color="#fff" />
          <Text className="text-white">Unsubmit</Text>
        </Pressable>
      )}
    </View>
  );
};

export default SubmissionBox;
