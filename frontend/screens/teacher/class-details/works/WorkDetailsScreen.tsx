import { RouteProp, useRoute } from '@react-navigation/native';
import FileCard from 'components/FileCard';
import Header from 'components/Header';
import { Text } from 'components/ui/Text';
import WorkTypeBadge from 'components/ui/WorkTypeBadge';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { TeacherStackParamList } from 'types/navigation';
import { IWorkMaterial } from 'types/work';

type WorkDetailsRouteProp = RouteProp<TeacherStackParamList, 'WorkDetailsScreen'>;

const WorkDetailsScreen = () => {
  const route = useRoute<WorkDetailsRouteProp>();
  const { work } = route.params;

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
                <Text className="text-xl font-bold text-green-600">7</Text>
              </View>
              <View className="items-ce flex-1">
                <Text className="text-sm font-semibold uppercase text-slate-400">Missing</Text>
                <Text className="text-xl font-bold text-red-500">7</Text>
              </View>
              <View className="items-ce flex-1">
                <Text className="text-sm font-semibold uppercase text-slate-400">Total</Text>
                <Text className="text-xl font-bold">7</Text>
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
            <Text className="text-sm font-semibold uppercase text-slate-500">Submission (8)</Text>

            <View className="mb-8 gap-2">
              {work.materials.map((material: IWorkMaterial) => (
                <FileCard key={material.id} file={material.file} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkDetailsScreen;
