import Header from 'components/Header';
import { Text } from 'components/ui/Text';
import { ChevronRight, EllipsisVertical, Video } from 'lucide-react-native';
import { ScrollView, TouchableOpacity, View } from 'react-native';

const StudentClassesScreen = () => {
  return (
    <View className="flex-1 bg-slate-50">
      <Header title="My Classes" />

      <ScrollView
        className="px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        {/* Class Container */}
        <View className="mb-5 rounded-2xl bg-white shadow-lg">
          {/* TOP */}
          <View className="flex-row items-start justify-between rounded-t-2xl bg-indigo-500 px-5 py-7">
            <View className="gap-1">
              <Text className="text-2xl font-bold text-white">Algebra & Trigonometry</Text>
              <Text className="font-semibold text-white">Teacher: Mr. Cruz</Text>
            </View>

            <TouchableOpacity onPress={() => alert('show Settings')}>
              <EllipsisVertical color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* BOTTOM */}
          <View className="gap-5 px-5 py-6">
            <View className="gap-1">
              <Text className="font-semibold text-slate-500">Section: 10-Section A</Text>
              <Text className="font-semibold text-slate-500">Time: 8:00 - 9:00 AM</Text>
              <Text className="font-semibold text-slate-500">Room: 203</Text>
            </View>

            <View className="flex-row items-center gap-3">
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-indigo-500 p-4">
                <Text className="text-white">Open Class</Text>
                <ChevronRight size={20} color="#ffffff" />
              </TouchableOpacity>

              <TouchableOpacity className="rounded-2xl  bg-green-200 p-4">
                <Video size={20} color="#90CF8E" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mb-5 rounded-2xl bg-white shadow-lg">
          {/* TOP */}
          <View className="flex-row items-start justify-between rounded-t-2xl bg-orange-300 px-5 py-7">
            <View className="gap-1">
              <Text className="text-2xl font-bold text-white">Algebra & Trigonometry</Text>
              <Text className="font-semibold text-white">Teacher: Mr. Cruz</Text>
            </View>

            <TouchableOpacity onPress={() => alert('show Settings')}>
              <EllipsisVertical color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* BOTTOM */}
          <View className="gap-5 px-5 py-6">
            <View className="gap-1">
              <Text className="font-semibold text-slate-500">Section: 10-Section A</Text>
              <Text className="font-semibold text-slate-500">Time: 8:00 - 9:00 AM</Text>
              <Text className="font-semibold text-slate-500">Room: 203</Text>
            </View>

            <View className="flex-row items-center gap-3">
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-orange-300 p-4">
                <Text className="text-white">Open Class</Text>
                <ChevronRight size={20} color="#ffffff" />
              </TouchableOpacity>

              <TouchableOpacity className="rounded-2xl  bg-green-200 p-4">
                <Video size={20} color="#90CF8E" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mb-5 rounded-2xl bg-white shadow-lg">
          {/* TOP */}
          <View className="flex-row items-start justify-between rounded-t-2xl bg-yellow-400 px-5 py-7">
            <View className="gap-1">
              <Text className="text-2xl font-bold text-white">Algebra & Trigonometry</Text>
              <Text className="font-semibold text-white">Teacher: Mr. Cruz</Text>
            </View>

            <TouchableOpacity onPress={() => alert('show Settings')}>
              <EllipsisVertical color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* BOTTOM */}
          <View className="gap-5 px-5 py-6">
            <View className="gap-1">
              <Text className="font-semibold text-slate-500">Section: 10-Section A</Text>
              <Text className="font-semibold text-slate-500">Time: 8:00 - 9:00 AM</Text>
              <Text className="font-semibold text-slate-500">Room: 203</Text>
            </View>

            <View className="flex-row items-center gap-3">
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-yellow-400 p-4">
                <Text className="text-white">Open Class</Text>
                <ChevronRight size={20} color="#ffffff" />
              </TouchableOpacity>

              <TouchableOpacity className="rounded-2xl  bg-green-200 p-4">
                <Video size={20} color="#90CF8E" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default StudentClassesScreen;
