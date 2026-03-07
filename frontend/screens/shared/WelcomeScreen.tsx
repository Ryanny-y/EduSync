import { Text } from 'components/ui/Text';
import { BookOpen, ChevronRight, GraduationCap } from 'lucide-react-native';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from 'types/navigation';
import Pressable from 'components/ui/Pressable';

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  return (
    <View className="flex-1 items-center justify-center bg-background px-5">
      <View className='border rounded-lg border-green-400 h-60 w-10/12 mb-10'/>

      <View className="items-center">
        <View className="items-center">
          <Text className="text-4xl font-bold">Smart Learning.</Text>
          <Text className="text-4xl font-bold">Even Offline.</Text>
        </View>

        <View className="my-[15px]">
          <Text className="text-center text-[18px] text-slate-500">
            Track performance and collaborate in real-time, regardless of your
            internet connection.
          </Text>
        </View>
      </View>

      <View className="w-full">
        <Pressable
          onPress={() => navigation.navigate('LoginScreen', { role: 'STUDENT' })}
          className="mt-5 rounded-xl bg-green-500 px-6 py-[14px]"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-[14px]">
              <BookOpen color="#ffffff" />
              <Text className="text-[16px] font-bold text-white">
                Continue as Student
              </Text>
            </View>
            <ChevronRight color="#ffffff" />
          </View>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('LoginScreen', { role: 'TEACHER' })}
          className="mt-5 rounded-xl border-2 border-green-400 px-6 py-[14px]"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-[14px]">
              <GraduationCap color="#90CF8E" />
              <Text className="text-[16px] font-bold text-green-500">
                Continue as Teacher
              </Text>
            </View>
            <ChevronRight color="#90CF8E" />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default WelcomeScreen;