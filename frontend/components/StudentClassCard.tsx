import { Pressable, View } from 'react-native';
import { Text } from './ui/Text';
import { ChevronRight, EllipsisVertical, Video } from 'lucide-react-native';
import { IClass } from 'types/class';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useState } from 'react';
import { ApiResponse } from 'types/common';
import Toast from 'react-native-toast-message';
import useMutation from 'hooks/useMutation';
import { getErrorMessage } from 'utils/errorHandler';

const StudentClassCard = ({
  item,
  refetchData,
}: { item: IClass } & { refetchData: () => void }) => {
  const { execute } = useMutation();
  const [isUnenrolling, setIsUnenrolling] = useState(false);

  const handleUnenroll = async () => {
    if (isUnenrolling) return;
    setIsUnenrolling(true);

    try {
      const response: ApiResponse<void> = await execute(`class/${item.id}/unenroll`, {
        method: 'POST',
      });

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
      setIsUnenrolling(false);
    }
  };

  return (
    <View className="mb-5 rounded-2xl bg-white shadow-lg">
      {/* TOP */}
      <View
        className="flex-row items-start justify-between rounded-t-2xl px-5 py-7"
        style={{ backgroundColor: item.bgColor || '#22c55e' }}>
        <View className="flex-1 gap-1 pr-3">
          <Text className="text-2xl font-bold text-white">
            {item.name} - {item.subject}
          </Text>
          <Text className="font-semibold text-white">Teacher: {item.teacher}</Text>
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
              onSelect={handleUnenroll}>
              <View className="flex-row items-center gap-2 p-2">
                <Text>Unenroll</Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>

      {/* BOTTOM */}
      <View className="gap-5 px-5 py-6">
        <View className="gap-1">
          <Text className="font-semibold text-slate-500">Section: {item.section}</Text>
          <Text className="font-semibold text-slate-500">Time: {item.time}</Text>
          <Text className="font-semibold text-slate-500">Room: {item.room}</Text>
          <Text className="font-semibold text-slate-500">Students: {item.studentCount}</Text>
        </View>

        <View className="flex-row items-center gap-3">
          <Pressable
            className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl p-4"
            style={{ backgroundColor: item.bgColor || '#22c55e' }}>
            <Text className="text-white">Open Class</Text>
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

export default StudentClassCard;
