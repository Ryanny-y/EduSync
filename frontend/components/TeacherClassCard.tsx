import { Linking, View } from 'react-native';
import { Text } from './ui/Text';
import {
  ChevronRight,
  Clock,
  Edit,
  EllipsisVertical,
  MapPin,
  Trash2,
  Users,
  Video,
} from 'lucide-react-native';
import React, { useState } from 'react';
import Pressable from './ui/Pressable';
import { IClass } from 'types/class';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import useMutation from 'hooks/useMutation';
import { getErrorMessage } from 'utils/errorHandler';
import { ApiResponse } from 'types/common';
import Toast from 'react-native-toast-message';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TeacherStackParamList } from 'types/navigation';
import { useNavigation } from '@react-navigation/native';

type NavigationProps = NativeStackNavigationProp<TeacherStackParamList, 'EditClassScreen'>;

const TeacherClassCard = ({
  item,
  refetchData,
}: { item: IClass } & { refetchData: () => void }) => {
  const { execute } = useMutation();
  const navigation = useNavigation<NavigationProps>();

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const handleConfirmDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const response: ApiResponse<void> = await execute(`class/${item.id}`, {
        method: 'DELETE',
      });

      setDeleteModalVisible(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: response.message,
      });
      refetchData();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: getErrorMessage(error),
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <View className="mb-5 rounded-2xl rounded-t-2xl bg-white shadow-lg">
        {/* TOP */}
        <View
          className="relative flex-row items-start justify-between rounded-t-2xl px-5 py-7"
          style={{ backgroundColor: item.bgColor || '#22c55e' }}>
          <View className="flex-1 gap-1 pr-3">
            <Text className="text-2xl font-bold text-white">
              {item.name} - {item.subject}
            </Text>
            <Text className="text-xl font-bold text-white">Section: {item.section}</Text>
          </View>

          <Menu>
            <MenuTrigger>
              <EllipsisVertical color="#ffffff" size={20} />
            </MenuTrigger>

            <MenuOptions
              customStyles={{
                optionsContainer: {
                  width: 140,
                  borderRadius: 10,
                  paddingVertical: 2,
                  backgroundColor: 'white',
                },
              }}>
              <MenuOption
                customStyles={{
                  optionTouchable: {
                    activeOpacity: 0.6,
                  },
                }}
                onSelect={() => navigation.navigate('EditClassScreen', { classData: item })}>
                <View className="flex-row items-center gap-2 p-2">
                  <Edit size={16} />
                  <Text>Edit</Text>
                </View>
              </MenuOption>

              <MenuOption
                customStyles={{
                  optionTouchable: {
                    activeOpacity: 0.6,
                  },
                }}
                onSelect={() => {
                  setDeleteModalVisible(true);
                }}>
                <View className="flex-row items-center gap-2 p-2">
                  <Trash2 size={16} color={'#ef4444'} />
                  <Text className="text-red-500">Delete</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>

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
              onPress={() => navigation.navigate('ClassDetailsScreen', { classId: item.id })}
              className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl p-4"
              style={{ backgroundColor: item.bgColor || '#22c55e' }}>
              <Text className="font-bold text-white">Open Class</Text>
              <ChevronRight size={20} color="#ffffff" />
            </Pressable>

            <Pressable
              className="rounded-2xl bg-green-200 p-4"
              onPress={() => {
                if (item.gmeetLink) {
                  Linking.openURL(item.gmeetLink).catch((err) =>
                    console.error('Failed to open link:', err)
                  );
                } else {
                  console.warn('No Google Meet link available for this class');
                }
              }}>
              <Video size={20} color="#90CF8E" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title={item.name}
      />
    </>
  );
};

export default TeacherClassCard;
