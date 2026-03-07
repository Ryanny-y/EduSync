import { TouchableOpacity, View } from "react-native";
import { Text } from "./ui/Text";
import { ChevronRight, EllipsisVertical, Video } from "lucide-react-native";

const ClassCard = ({ item }: any) => {
  return (
    <View className="mb-5 rounded-2xl bg-white shadow-lg">
      {/* TOP */}
      <View
        className={`flex-row items-start justify-between rounded-t-2xl px-5 py-7 ${item.color}`}>
        <View className="gap-1 flex-1 pr-3">
          <Text className="text-2xl font-bold text-white">{item.title}</Text>
          <Text className="font-semibold text-white">Teacher: {item.teacher}</Text>
        </View>

        <TouchableOpacity onPress={() => alert('show Settings')}>
          <EllipsisVertical color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* BOTTOM */}
      <View className="gap-5 px-5 py-6">
        <View className="gap-1">
          <Text className="font-semibold text-slate-500">
            Section: {item.section}
          </Text>
          <Text className="font-semibold text-slate-500">
            Time: {item.time}
          </Text>
          <Text className="font-semibold text-slate-500">
            Room: {item.room}
          </Text>
          <Text className="font-semibold text-slate-500">
            Students: {item.students}
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl p-4 ${item.color}`}>
            <Text className="text-white">Open Class</Text>
            <ChevronRight size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity className="rounded-2xl bg-green-200 p-4">
            <Video size={20} color="#90CF8E" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ClassCard