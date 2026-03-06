import Header from 'components/Header';
import { Text } from 'components/ui/Text';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import {
  Calendar,
  Clock,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react-native';
import StatusBadge from 'components/ui/StatusBadge';

type WorkItem = {
  id: string;
  subject: string;
  title: string;
  description: string;
  deadline: string;
  status: 'Submitted' | 'Late' | 'Pending';
};

const SUBJECTS = ['All', 'Math', 'Science', 'English', 'Politics', 'Chemistry'];

const ALL_WORKS: WorkItem[] = [
  {
    id: '1',
    subject: 'Math',
    title: 'Algebra Assignment',
    description: 'Solve the equations from chapter 4.',
    deadline: 'Mar 10, 11:59',
    status: 'Pending',
  },
  {
    id: '2',
    subject: 'Science',
    title: 'Photosynthesis Report',
    description: 'Create a short report about plant energy.',
    deadline: 'Mar 5, 11:59',
    status: 'Late',
  },
  {
    id: '3',
    subject: 'English',
    title: 'Essay Writing',
    description: 'Write a 500-word essay about climate change.',
    deadline: 'Mar 2: 11:59',
    status: 'Submitted',
  },
];

const STATUS_CONFIG = {
  Submitted: {
    label: 'Submitted',
    icon: <CheckCircle2 size={12} color="#10b981" />,
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    textColor: '#10b981',
  },
  Late: {
    label: 'Late',
    icon: <AlertCircle size={12} color="#ef4444" />,
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    textColor: '#ef4444',
  },
  Pending: {
    label: 'Pending',
    icon: <Clock size={12} color="#64748b" />,
    bgColor: '#f1f5f9',
    borderColor: '#e2e8f0',
    textColor: '#64748b',
  },
};

const StudentWorksScreen = () => {
  const [selectedSubject, setSelectedSubject] = useState('All');

  const filteredWorks =
    selectedSubject === 'All'
      ? ALL_WORKS
      : ALL_WORKS.filter((work) => work.subject === selectedSubject);

  return (
    <View className="flex-1 bg-slate-50">
      <Header title="My Works" />

      {/* Subject Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        className="grow-0 border-b border-slate-100 py-5 px-4">
        {SUBJECTS.map((subject) => {
          const active = subject === selectedSubject;

          return (
            <TouchableOpacity
              key={subject}
              onPress={() => setSelectedSubject(subject)}
              className={`mr-2 rounded-full px-5 py-2 ${
                active ? 'bg-green-500' : 'bg-slate-100'
              }`}>
              <Text className={`text-sm font-semibold ${active ? 'text-white' : 'text-slate-500'}`}>
                {subject}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Works List */}
      <ScrollView className="flex-1 px-4 pt-4">
        {filteredWorks.map((work) => {
          const badge = STATUS_CONFIG[work.status];

          return (
            <TouchableOpacity
              key={work.id}
              activeOpacity={0.8}
              className="mb-4 rounded-2xl border border-slate-100 bg-white p-5">
              {/* Top Row */}
              <View className="mb-3 flex-row items-start justify-between">
                <View className="rounded-lg bg-green-50 px-3 py-1">
                  <Text className="text-[10px] font-bold uppercase text-green-600">
                    {work.subject}
                  </Text>
                </View>

                <StatusBadge
                  label={badge.label}
                  icon={badge.icon}
                  bgColor={badge.bgColor}
                  borderColor={badge.borderColor}
                  textColor={badge.textColor}
                />
              </View>

              {/* Title */}
              <Text className="mb-1 text-lg font-bold text-slate-900">{work.title}</Text>

              {/* Description */}
              <Text className="mb-4 text-sm text-slate-500" numberOfLines={2}>
                {work.description}
              </Text>

              {/* Bottom Row */}
              <View className="flex-row items-center justify-between border-t border-slate-100 pt-4">
                <View className="flex-row items-center space-x-4">
                  <View className="flex-row items-center space-x-1 gap-2">
                    <Calendar size={16} color="#94a3b8" />
                    <Text className="text-xs text-slate-400">{work.deadline}</Text>
                  </View>
                </View>

                <ChevronRight size={18} color="#cbd5f5" />
              </View>
            </TouchableOpacity>
          );
        })}
        {filteredWorks.length === 0 && (
          <View className="items-center py-20">
            <Calendar size={40} color="#cbd5f5" />
            <Text className="mt-4 font-bold">No works found</Text>
            <Text className="text-sm text-slate-500">
              There are no assignments for this subject.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg">
        <Plus color="white" size={26} />
      </TouchableOpacity>
    </View>
  );
};

export default StudentWorksScreen;
