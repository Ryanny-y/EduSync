import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import { workStatusStyle } from 'components/ui/WorkTypeBadge';
import dayjs from 'dayjs';
import useFetchData from 'hooks/useFetchData';
import { ChevronRight, CircleAlert, Clock } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { ApiResponse } from 'types/common';
import { StudentStackParamList } from 'types/navigation';
import { IStudentWork } from 'types/work';

type PendingWorksNavigationProps = NativeStackNavigationProp<
  StudentStackParamList,
  'StudentWorksScreen'
>;

const PendingWorks = () => {
  const { data, loading, error, refetchData } =
    useFetchData<ApiResponse<IStudentWork[]>>(`works/my/all`);

  useFocusEffect(
    useCallback(() => {
      refetchData();
    }, [refetchData])
  );

  const navigation = useNavigation<PendingWorksNavigationProps>();

  const pendingWorks = useMemo(() => {
    if (!data?.data) return [];

    return data.data
      .filter((work) => work.submissionStatus === 'PENDING' || work.submissionStatus === 'MISSING')
      .slice(0, 4);
  }, [data]);

  return (
    <View className="gap-5">
      {/* Title */}
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold">Pending Works</Text>

        <Pressable onPress={() => navigation.navigate('StudentWorksScreen')}>
          <Text className="font-bold text-green-600">View All</Text>
        </Pressable>
      </View>

      {/* Works Container */}
      {pendingWorks.map((work) => {
        const isOverdue = work.submissionStatus === 'MISSING';

        let dueText = '';

        if (!isOverdue) {
          if (!work.dueDate) {
            dueText = 'No Due Date';
          } else {
            const due = dayjs(work.dueDate);

            dueText = due.isSame(dayjs(), 'day')
              ? `Today, ${due.format('hh:mm A')}`
              : due.format('MMM DD, hh:mm A');
          }
        }

        const typeStyle = workStatusStyle[work.type as keyof typeof workStatusStyle];

        return (
          <View key={work.id} className="flex-row items-center gap-3 rounded-xl bg-white p-5">
            <View className={`rounded-xl p-4 ${isOverdue ? 'bg-red-50' : 'bg-green-100'}`}>
              {isOverdue ? (
                <CircleAlert size={28} color="#dc2626" />
              ) : (
                <Clock size={28} color="#16a34a" />
              )}
            </View>

            <View className="gap-0.5">
              <Text className={`text-xs font-bold ${typeStyle?.text ?? 'text-slate-500'}`}>
                {work.type}
              </Text>

              <Text className="text-xl font-bold">{work.title}</Text>

              <Text className="text-xs font-medium text-slate-500">
                {isOverdue ? 'Overdue' : dueText}
              </Text>
            </View>

            <View className="ml-auto">
              <ChevronRight color="#64748b" />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default PendingWorks;
