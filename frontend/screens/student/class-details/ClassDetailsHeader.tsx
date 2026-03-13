import Pressable from 'components/ui/Pressable';
import { ChevronLeft, Video, MoreVertical, BookOpen, Clock, MapPin } from 'lucide-react-native';
import { Linking, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { generateGradient } from 'utils/colors';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { IClass } from 'types/class';
import { getErrorMessage } from 'utils/errorHandler';

const ClassDetailHeader = ({ item }: { item: IClass }) => {
  const navigation = useNavigation();
  const gradient = generateGradient(item.bgColor);

  return (
    <LinearGradient
      colors={gradient}
      locations={[0, 0.4, 1]}
      className="w-full gap-8 px-5 pb-7 pt-16">
      {/* Top Navigation */}
      <View className="flex-row items-center justify-between">
        <Pressable
          onPress={() => navigation.goBack()}
          className="rounded-full border border-white/40 bg-white/20 p-2">
          <ChevronLeft color="#ffffff" />
        </Pressable>

        <View className="flex-row items-center gap-3">
          <Pressable
            className="rounded-full border border-white/40 bg-white/20 p-3"
            onPress={() => {
              if (item.gmeetLink) {
                Linking.openURL(item.gmeetLink).catch((err) => {
                  Toast.show({
                    type: 'error',
                    text1: 'Failed to open link:',
                    text2: getErrorMessage(err),
                  });
                });
              } else {
                Toast.show({
                  type: 'info',
                  text1: 'No Google Meet link available for this class',
                });
              }
            }}>
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
        <View className="flex-1 gap-2 pr-3">
          <View className='flex-row items-center gap-2'>
            <View className='bg-white/20 p-3 border border-slate-50/20 rounded-xl'>
              <BookOpen color="#fff" size={20}/>
            </View>
            <Text className="text-lg font-semibold text-slate-100">{item.section}</Text>
          </View>
          <Text numberOfLines={2} className="text-3xl font-bold text-white">
            {item.name} - {item.subject}
          </Text>
          
          <View className='flex-row item-center gap-2'>
            <Clock color="#fff" size={16}/>
            <Text className="text-sm font-semibold text-slate-200">{item.time}</Text>
          </View>

          <View className='flex-row item-center gap-2'>
            <MapPin color="#fff" size={16}/>
            <Text className="text-sm font-semibold text-slate-200">Room {item.room}</Text>
          </View>

          <View className='flex-row item-center gap-2'>
            <MapPin color="#fff" size={16}/>
            <Text className="text-sm font-semibold text-slate-200">Teacher {item.teacher}</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default ClassDetailHeader;
