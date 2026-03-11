import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import { ChevronRight, Clock, Users } from 'lucide-react-native';
import { View } from 'react-native';
import { TeacherStackParamList } from 'types/navigation';

type Props = {
  id: string;
  name: string,
  subject: string;
  section: string;
  time: string;
  studentCount: number;
};

type NavigationProps = NativeStackNavigationProp<TeacherStackParamList, 'ClassDetailsScreen'>;

const ClassCard = ({ id, name, subject, section, time, studentCount }: Props) => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <Pressable className="relative flex-row items-center justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg" onPress={() => navigation.navigate("ClassDetailsScreen", { classId: id })}>
      {/* subtle background accent */}
      <View className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-green-200 opacity-60" />
      <View className="absolute -bottom-16 -left-2 h-32 w-32 rounded-full bg-green-200 opacity-60" />

      {/* LEFT SIDE */}
      <View className="flex-1 flex-row items-center gap-4">
        {/* Floating Subject Circle */}
        <View className="h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-md">
          <Text className="text-xs font-bold text-white">{subject.slice(0, 2).toUpperCase()}</Text>
        </View>

        {/* Content */}
        <View className="flex-1 gap-1">
          <Text className="font-semibold text-slate-500">{section}</Text>

          <Text className="text-xl font-bold text-slate-900" numberOfLines={1}>
            {name} - {subject}
          </Text>

          {/* Responsive metadata */}
          <View className="mt-1 flex-row flex-wrap gap-x-5 gap-y-1">
            <View className="flex-row items-center gap-1">
              <Clock size={15} color="#64748b" />
              <Text className="text-sm font-semibold text-slate-500">{time}</Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Users size={15} color="#64748b" />
              <Text className="text-sm font-semibold text-slate-500">{studentCount} studentCount</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Chevron Button */}
      <View className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-slate-50">
        <ChevronRight size={18} color="#16a34a" />
      </View>
    </Pressable>
  );
};

export default ClassCard;
