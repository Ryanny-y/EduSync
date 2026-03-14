import { View } from 'react-native';
import { Text } from 'components/ui/Text';
import { SubmissionStatus } from 'types/submission';

interface Props {
  status: SubmissionStatus;
}

const SubmissionStatusBadge = ({ status }: Props) => {
  const normalized = status?.toUpperCase();

  const styles = {
    PENDING: {
      bg: 'bg-gray-200',
      text: 'text-gray-500',
    },
    SUBMITTED: {
      bg: 'bg-green-50',
      text: 'text-green-600',
    },
    GRADED: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-500',
    },
    LATE: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
    },
    MISSING: {
      bg: 'bg-red-50',
      text: 'text-red-500',
    },
  };

  const badge = styles[normalized as keyof typeof styles] ?? styles.PENDING;

  return (
    <View className={`rounded-full px-2 py-1 ${badge.bg}`}>
      <Text className={`text-[10px] font-bold ${badge.text}`}>
        {normalized}
      </Text>
    </View>
  );
};

export default SubmissionStatusBadge;