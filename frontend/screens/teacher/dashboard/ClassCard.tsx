import { Text } from "components/ui/Text";
import { ChevronRight, Clock, Users } from "lucide-react-native";
import { View } from "react-native";

type Props = {
  subject: string;
  title: string;
  time: string;
  students: number;
};

const ClassCard = ({ subject, title, time, students }: Props) => {
  return (
    <View className="relative flex-row items-center justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">

      {/* subtle background accent */}
      <View className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-green-200 opacity-60" />
      <View className="absolute -bottom-16 -left-2 h-32 w-32 rounded-full bg-green-200 opacity-60" />

      {/* LEFT SIDE */}
      <View className="flex-1 flex-row items-center gap-4">

        {/* Floating Subject Circle */}
        <View className="h-12 w-12 items-center justify-center rounded-full bg-green-500 shadow-md">
          <Text className="text-xs font-bold text-white">
            {subject.slice(0, 2).toUpperCase()}
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 gap-1">
          <Text className="font-semibold text-slate-500">
            {subject}
          </Text>

          <Text
            className="text-xl font-bold text-slate-900"
            numberOfLines={1}
          >
            {title}
          </Text>

          {/* Responsive metadata */}
          <View className="mt-1 flex-row flex-wrap gap-x-5 gap-y-1">

            <View className="flex-row items-center gap-1">
              <Clock size={15} color="#64748b" />
              <Text className="text-sm font-semibold text-slate-500">
                {time}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Users size={15} color="#64748b" />
              <Text className="text-sm font-semibold text-slate-500">
                {students} Students
              </Text>
            </View>

          </View>
        </View>
      </View>

      {/* Chevron Button */}
      <View className="ml-3 h-9 w-9 items-center justify-center rounded-full bg-slate-50">
        <ChevronRight size={18} color="#16a34a" />
      </View>

    </View>
  );
};

export default ClassCard;