import { Text } from 'components/ui/Text';
import { BookOpen, MessageSquare } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

const QuickActionCards = () => {
  return (
    <View className="mt-8 w-full flex-row gap-3">
      <TouchableOpacity className="flex-1">
        <View className="items-center gap-3 rounded-lg bg-white p-5">
          <View className="rounded-xl bg-indigo-50 p-3">
            <BookOpen color="#6366f1" />
          </View>
          <Text className="font-semibold text-slate-500">Lessons</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="flex-1">
        <View className="items-center gap-3 rounded-lg bg-white p-5">
          <View className="rounded-xl bg-yellow-50 p-3">
            <MessageSquare color="#eab308" />
          </View>
          <Text className="font-semibold text-slate-500">Message</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity className="flex-1">
        <View className="items-center gap-3 rounded-lg bg-white p-5">
          <View className="rounded-xl bg-green-50 p-3">
            <BookOpen color="#90CF8E" />
          </View>
          <Text className="font-semibold text-slate-500">Lessons</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default QuickActionCards;
