import Pressable from 'components/ui/Pressable';
import { ChevronLeft, Copy, Video, MoreVertical } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { generateGradient } from 'utils/colors';
import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { IClass } from 'types/class';

const ClassDetailHeader = ({ item }: { item: IClass }) => {
  const navigation = useNavigation();
  const gradient = generateGradient(item.bgColor);

  const copyCode = async () => {
    await Clipboard.setStringAsync(item.code);

    Toast.show({
      type: 'success',
      text1: 'Copied',
      text2: 'Class code copied to clipboard',
    });
  };

  return (
    <LinearGradient
      colors={gradient}
      locations={[0, 0.4, 1]}
      className="w-full gap-8 px-5 pb-7 pt-16"
    >
      {/* Top Navigation */}
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() => navigation.goBack()}
          className="rounded-full border border-white/40 bg-white/20 p-2"
        >
          <ChevronLeft color="#ffffff" />
        </Pressable>

        <View className="flex-row items-center gap-3">
          <Pressable className="rounded-full border border-white/40 bg-white/20 p-3">
            <Video color="#ffffff" size={20} />
          </Pressable>

          <Pressable className="rounded-full border border-white/40 bg-white/20 p-3">
            <MoreVertical color="#ffffff" size={20} />
          </Pressable>
        </View>
      </View>

      {/* Bottom Section */}
      <View className="flex-row items-start justify-between gap-3">
        {/* Class Info */}
        <View className="flex-1 gap-1 pr-3">
          <Text numberOfLines={2} className="text-3xl font-bold text-white">
            {item.name}
          </Text>
          
          <Text numberOfLines={2} className="text-2xl font-bold text-slate-100">
            {item.subject}
          </Text>

          <Text className="text-base font-semibold text-slate-100">
            Section: {item.section}
          </Text>

          <Text className="text-sm font-semibold text-slate-200">
            Time: {item.time}
          </Text>
          <Text className="text-sm font-semibold text-slate-200">
            Room: {item.room}
          </Text>
        </View>

        {/* Class Code Badge */}
        <View className="min-w-[120px] items-center rounded-2xl border border-white/40 bg-white/15 px-5 py-3">
          <Text className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-200">
            Class Code
          </Text>

          <Pressable
            onPress={copyCode}
            className="flex-row items-center gap-2"
          >
            <Text className="text-lg font-black tracking-wider text-white">
              {item.code}
            </Text>

            <Copy size={16} color="#ffffff" />
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ClassDetailHeader;