import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import { useAuth } from 'context/AuthContext';
import { LogOut, MessageSquare, Wifi } from 'lucide-react-native';
import { View } from 'react-native';
import { getGreeting } from 'utils/helpers';
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

const TeacherDashboardHeader = () => {
  const { user, logout } = useAuth();
  const [isConnected, setIsConnected] = useState<boolean | null>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(!!state.isConnected && !!state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View className="mb-10">
      {/* Top Row */}
      <View className="flex w-full flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-bold text-slate-400">
            {getGreeting()},
          </Text>

          <Text className="text-xl font-semibold">
            {`${user?.lastName}, ${user?.firstName}`}
          </Text>
        </View>

        <Pressable
          className="rounded-lg bg-white p-2 shadow-lg"
          onPress={logout}>
          <LogOut />
        </Pressable>
      </View>

      {/* Status Row */}
      <View className="mt-8 flex-row items-start justify-between rounded-lg bg-white p-2 shadow-lg">
        <View
          className={`flex-row items-center gap-1.5 rounded-xl px-2 py-1 ${
            isConnected ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <Wifi
            size={16}
            color={isConnected ? '#15803d' : '#dc2626'}
          />

          <Text
            className={`text-sm font-medium ${
              isConnected ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {isConnected ? 'Online' : 'Offline'}
          </Text>
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

export default TeacherDashboardHeader;