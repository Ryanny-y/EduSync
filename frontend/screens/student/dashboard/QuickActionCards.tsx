import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import { BookOpen, MessageSquare, Video } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { StudentStackParamList } from 'types/navigation';

type PendingWorksNavigationProps = NativeStackNavigationProp<StudentStackParamList, "StudentClassesScreen">;

const QuickActionCards = () => {
  const navigation = useNavigation<PendingWorksNavigationProps>();

  return (
    <View className="mt-8 w-full flex-row gap-3">
      {/* <Pressable className="flex-1">
        <View className="items-center gap-3 rounded-lg bg-white p-5">
          <View className="rounded-xl bg-indigo-50 p-3">
            <BookOpen color="#6366f1" />
          </View>
          <Text className="font-semibold text-slate-500 text-sm">Lessons</Text>
        </View>
      </Pressable> */}

      <Pressable className="flex-1">
        <View className="items-center gap-3 rounded-lg bg-white p-5">
          <View className="rounded-xl bg-yellow-50 p-3">
            <MessageSquare color="#eab308" />
          </View>
          <Text className="font-semibold text-slate-500 text-sm">Messages</Text>
        </View>
      </Pressable>

      <Pressable className="flex-1" onPress={() => navigation.navigate("StudentClassesScreen")}>
        <View className="items-center gap-3 rounded-lg bg-white p-5">
          <View className="rounded-xl bg-green-50 p-3">
            <Video color="#90CF8E" />
          </View>
          <Text className="font-semibold text-slate-500 text-sm">Classrooms</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default QuickActionCards;
