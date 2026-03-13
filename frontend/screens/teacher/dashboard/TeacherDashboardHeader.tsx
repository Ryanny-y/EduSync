import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import { useAuth } from 'context/AuthContext';
import { LogOut, MessageSquare, Upload, Wifi } from 'lucide-react-native';
import { View } from 'react-native';

const StudentDashboardHeader = () => {
  const { user, logout } = useAuth();

  return (
    <View className="mb-10">
      <View className="flex w-full flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-bold text-slate-400">Good Day,</Text>
          <Text className="text-xl font-semibold">{`${user?.lastName}, ${user?.firstName}`}</Text>
        </View>

        <Pressable className="rounded-lg bg-white p-2 shadow-lg" onPress={logout}>
          <LogOut />
        </Pressable>
      </View>

      <View className="mt-8 flex-row items-start justify-between rounded-lg bg-white p-2 shadow-lg">
        <View className="flex-row items-center gap-1.5 rounded-xl bg-green-100 px-2 py-1">
          <Wifi size={16} color="#15803d" />
          <Text className=" text-sm font-medium text-green-700">Online</Text>
        </View>

        <View className="flex-row gap-3 pr-2">
          <Pressable>
            <MessageSquare size={20} color="#475569" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default StudentDashboardHeader;
