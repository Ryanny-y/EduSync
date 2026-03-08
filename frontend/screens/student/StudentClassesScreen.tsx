import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ClassCard from 'components/ClassCard';
import Header from 'components/Header';
import { Text } from 'components/ui/Text';
import { Plus } from 'lucide-react-native';
import { Pressable, ScrollView,View } from 'react-native';
import { StudentStackParamList } from 'types/navigation';

const classes = [
  {
    id: 1,
    title: 'Algebra & Trigonometry',
    teacher: 'Mr. Cruz',
    section: '10-Section A',
    time: '8:00 - 9:00 AM',
    room: '203',
    color: 'bg-indigo-500',
    students: 35
  },
  {
    id: 2,
    title: 'Algebra & Trigonometry',
    teacher: 'Mr. Cruz',
    section: '10-Section A',
    time: '8:00 - 9:00 AM',
    room: '203',
    color: 'bg-orange-300',
    students: 35
  },
  {
    id: 3,
    title: 'Algebra & Trigonometry',
    teacher: 'Mr. Cruz',
    section: '10-Section A',
    time: '8:00 - 9:00 AM',
    room: '203',
    color: 'bg-yellow-400',
    students: 35
  },
];

type NavigationProps = NativeStackNavigationProp<StudentStackParamList, 'JoinClassScreen'>;

const StudentClassesScreen = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View className="flex-1 bg-slate-50">
      <Header title="My Classes" />

      <ScrollView
        className="px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        {classes.map((item) => (
          <ClassCard key={item.id} item={item} />
        ))}
      </ScrollView>

      <Pressable
        onPress={() => navigation.navigate('JoinClassScreen')}
        className="absolute bottom-7 right-7 flex-row items-center gap-3 rounded-2xl bg-green-500 px-5 py-4 ">
        <Plus color="#ffffff" />
        <Text className="text-xl font-bold text-white">Join Class</Text>
      </Pressable>
    </View>
  );
};

export default StudentClassesScreen;
