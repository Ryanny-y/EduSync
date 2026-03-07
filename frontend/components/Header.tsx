import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from './ui/Text';

const Header = ({ title }: { title: string }) => {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center gap-5 px-4 pt-12 pb-5 bg-background">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeft className='bg-slate-500' size={24} color="#64748b"/>
      </TouchableOpacity>

      <Text className="text-2xl font-semibold">{title}</Text>
    </View>
  );
};

export default Header;