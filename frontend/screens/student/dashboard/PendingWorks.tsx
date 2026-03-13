import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import { ChevronRight, CircleAlert, Clock } from 'lucide-react-native';
import { View } from 'react-native';
import { StudentStackParamList } from 'types/navigation';

type PendingWorksNavigationProps = NativeStackNavigationProp<
  StudentStackParamList,
  'StudentWorksScreen'
>;

const PendingWorks = () => {
  const navigation = useNavigation<PendingWorksNavigationProps>();

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
      <View className="gap-4">
        <View className="flex-row items-center gap-3 rounded-xl bg-white p-5">
          <View className="rounded-xl bg-green-100 p-4">
            <Clock size={28} color="#16a34a" />
          </View>

          <View className="gap-0.5">
            <Text className="text-xs font-bold text-slate-500">MATHEMATICS</Text>
            <Text className="text-xl font-bold">Calculus Quiz 2</Text>
            <Text className="text-xs font-medium text-slate-500">Today, 11:59 PM</Text>
          </View>

          <View className="ml-auto justify-self-end">
            <ChevronRight color="#64748b" />
          </View>
        </View>

        <View className="flex-row items-center gap-3 rounded-xl bg-white p-5">
          <View className="rounded-xl bg-green-100 p-4">
            <Clock size={28} color="#16a34a" />
          </View>

          <View className="gap-0.5">
            <Text className="text-xs font-bold text-slate-500">PHYSICS</Text>
            <Text className="text-xl font-bold">Lab Report</Text>
            <Text className="text-xs font-medium text-slate-500">Today, 11:59 PM</Text>
          </View>

          <View className="ml-auto justify-self-end">
            <ChevronRight color="#64748b" />
          </View>
        </View>

        <View className="flex-row items-center gap-3 rounded-xl bg-white p-5">
          <View className="rounded-xl bg-red-50 p-4">
            <CircleAlert size={28} color="#dc2626" />
          </View>

          <View className="gap-0.5">
            <Text className="text-xs font-bold text-slate-500">HISTORY</Text>
            <Text className="text-xl font-bold">Essay</Text>
            <Text className="text- text-xs font-medium text-slate-500">Overdue</Text>
          </View>

          <View className="ml-auto justify-self-end">
            <ChevronRight color="#64748b" />
          </View>
        </View>

        <View className="flex-row items-center gap-3 rounded-xl bg-white p-5">
          <View className="rounded-xl bg-green-100 p-4">
            <Clock size={28} color="#16a34a" />
          </View>

          <View className="gap-0.5">
            <Text className="text-xs font-bold text-slate-500">MATHEMATICS</Text>
            <Text className="text-xl font-bold">Calculus Quiz 2</Text>
            <Text className="text-xs font-medium text-slate-500">Today, 11:59 PM</Text>
          </View>

          <View className="ml-auto justify-self-end">
            <ChevronRight color="#64748b" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default PendingWorks;
