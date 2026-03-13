import { View } from 'react-native';
import { Text } from 'components/ui/Text';
import { WorkType } from 'types/work';

interface Props {
  type: WorkType;
}

const WorkTypeBadge = ({ type }: Props) => {
  const normalized = type?.toUpperCase();

  const styles = {
    ASSIGNMENT: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-500',
    },
    ACTIVITY: {
      bg: 'bg-green-50',
      text: 'text-green-600',
    },
    QUIZ: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
    },
    PROJECT: {
      bg: 'bg-red-50',
      text: 'text-red-500',
    },
  };

  const badge = styles[normalized as keyof typeof styles] ?? styles.ASSIGNMENT;

  return (
    <View className={`rounded-full px-2 py-1 ${badge.bg}`}>
      <Text className={`text-[10px] font-bold ${badge.text}`}>
        {normalized}
      </Text>
    </View>
  );
};

export default WorkTypeBadge;