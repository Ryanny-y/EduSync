import Header from 'components/Header';
import { Text } from 'components/ui/Text';
import { ScrollView, View } from 'react-native';
import { useCallback, useState } from 'react';
import { Calendar, ChevronRight, CheckCircle2, AlertCircle, Clock } from 'lucide-react-native';
import Pressable from 'components/ui/Pressable';
import useFetchData from 'hooks/useFetchData';
import { ApiResponse } from 'types/common';
import { IStudentWork, WorkType } from 'types/work';
import { useFocusEffect } from '@react-navigation/native';
import dayjs from 'dayjs';
import { SubmissionStatus } from 'types/submission';
import SubmissionStatusBadge from 'components/ui/SubmissionStatusBadge';

const STATUS_CONFIG: Record<SubmissionStatus, any> = {
  SUBMITTED: {
    label: 'Submitted',
    icon: <CheckCircle2 size={12} color="#10b981" />,
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    textColor: '#10b981',
  },
  LATE: {
    label: 'Late',
    icon: <AlertCircle size={12} color="#ef4444" />,
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    textColor: '#ef4444',
  },
  PENDING: {
    label: 'Pending',
    icon: <Clock size={12} color="#64748b" />,
    bgColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    textColor: '#64748b',
  },
  MISSING: {
    label: 'Missing',
    icon: <AlertCircle size={12} color="#ef4444" />,
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    textColor: '#ef4444',
  },
  GRADED: {
    label: 'Graded',
    icon: <CheckCircle2 size={12} color="#3b82f6" />,
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    textColor: '#3b82f6',
  },
};

const TYPE_LABELS: Record<WorkType, string> = {
  ASSIGNMENT: 'Assignments',
  TASK: 'Tasks',
  QUIZ: 'Quizzes',
  PROJECT: 'Projects',
};

const TYPES: (WorkType | 'All')[] = ['All', 'ASSIGNMENT', 'TASK', 'QUIZ', 'PROJECT'];

const StudentWorksScreen = () => {
  const [selectedType, setSelectedType] = useState<'All' | WorkType>('All');

  // TODO: HANDLE LOADING AND ERROR STATE
  const { data, loading, error, refetchData } =
    useFetchData<ApiResponse<IStudentWork[]>>('works/my/all');

  useFocusEffect(
    useCallback(() => {
      refetchData();
    }, [refetchData])
  );

  const works = data?.data ?? [];

  const filteredWorks =
    selectedType === 'All' ? works : works.filter((work) => work.type === selectedType);

  return (
    <View className="flex-1 bg-slate-50">
      <Header title="My Works" />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="grow-0 border-b border-slate-100 px-4 py-5">
        {TYPES.map((type) => {
          const active = type === selectedType;

          return (
            <Pressable
              key={type}
              onPress={() => setSelectedType(type)}
              className={`mr-2 rounded-full px-5 py-2 ${active ? 'bg-green-500' : 'bg-slate-100'}`}>
              <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-500'}`}>
                {type === 'All' ? 'All' : TYPE_LABELS[type]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView className="flex-1 px-4 pt-4">
        {filteredWorks.map((work) => {
          const badge = STATUS_CONFIG[work.submissionStatus];

          const formattedDate = work.dueDate
            ? dayjs(work.dueDate).isSame(dayjs(), 'day')
              ? `Today, ${dayjs(work.dueDate).format('hh:mm A')}`
              : dayjs(work.dueDate).format('MMM DD, hh:mm A')
            : 'No Due Date';

          return (
            <Pressable
              key={work.id}
              className="mb-4 rounded-2xl border border-slate-100 bg-white p-5">
              {/* Top Row */}
              <View className="mb-3 flex-row items-start justify-between">
                <View className="rounded-lg bg-green-50 px-3 py-1">
                  <Text className="text-[10px] font-bold uppercase text-green-600">
                    {work.type}
                  </Text>
                </View>

                <SubmissionStatusBadge status={work.submissionStatus} />
              </View>

              {/* Title */}
              <Text className="mb-1 text-lg font-bold text-slate-900">{work.title}</Text>

              {/* Description */}
              <Text className="mb-4 text-sm text-slate-500" numberOfLines={2}>
                {work.description ?? 'No description'}
              </Text>

              {/* Bottom Row */}
              <View className="flex-row items-center justify-between border-t border-slate-100 pt-4">
                <View className="flex-row items-center gap-2">
                  <Calendar size={16} color="#94a3b8" />
                  <Text className="text-xs text-slate-400">{formattedDate}</Text>
                </View>

                <ChevronRight size={18} color="#cbd5f5" />
              </View>
            </Pressable>
          );
        })}

        {filteredWorks.length === 0 && (
          <View className="items-center py-20">
            <Calendar size={40} color="#cbd5f5" />
            <Text className="mt-4 font-bold">No works found</Text>
            <Text className="text-sm text-slate-500">
              There are no assignments for this filter.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default StudentWorksScreen;
