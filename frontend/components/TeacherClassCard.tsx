import { View } from 'react-native';
import { Text } from './ui/Text';
import { ChevronRight, Clock, EllipsisVertical, MapPin, Users, Video } from 'lucide-react-native';
import React from 'react';
import Pressable from './ui/Pressable';
import { IClass } from 'types/class';

const TeacherClassCard = ({ item }: { item: IClass }) => {
  return (
    <View className="mb-5 rounded-2xl rounded-t-2xl bg-white shadow-lg">
      {/* TOP */}
      <View
        className="relative flex-row items-start justify-between rounded-t-2xl px-5 py-7"
        style={{ backgroundColor: item.bgColor || '#22c55e' }}>
        <View className="flex-1 gap-1 pr-3">
          <Text className="text-2xl font-bold text-white">{item.name}</Text>
          <Text className="text-xl font-bold text-white">Section: {item.section}</Text>
        </View>

        <Pressable onPress={() => alert('show Settings')}>
          <EllipsisVertical color="#ffffff" size={20} />
        </Pressable>

        <View className="absolute bottom-3 right-3 rounded-xl bg-white p-2">
          <Text className="text-sm font-semibold text-slate-900">Code: {item.code}</Text>
        </View>
      </View>

      {/* BOTTOM */}
      <View className="gap-5 px-5 py-6">
        <View className="gap-1.5">
          <View className="flex-row items-center gap-2">
            <Clock size={16} color="#64748b" />
            <Text className="font-semibold text-slate-500">{item.time}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <MapPin size={16} color="#64748b" />
            <Text className="font-semibold text-slate-500">Room {item.room}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Users size={16} color="#64748b" />
            <Text className="font-semibold text-slate-500">{item.studentCount} students</Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <Pressable
            className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl p-4"
            style={{ backgroundColor: item.bgColor || '#22c55e' }}>
            <Text className="font-bold text-white">Open Class</Text>
            <ChevronRight size={20} color="#ffffff" />
          </Pressable>

          <Pressable className="rounded-2xl bg-green-200 p-4">
            <Video size={20} color="#90CF8E" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default TeacherClassCard;
