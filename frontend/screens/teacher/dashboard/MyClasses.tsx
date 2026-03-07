import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from 'components/ui/Text';
import { TouchableOpacity, View } from 'react-native';
import { TeacherStackParamList } from 'types/navigation';
import ClassCard from './ClassCard';

type NavigationProps = NativeStackNavigationProp<TeacherStackParamList, 'TeacherClassesScreen'>;

const classes = [
  {
    id: 1,
    subject: 'Algebra & Trigonometry',
    teacher: 'Mr. Cruz',
    section: '10-Section A',
    time: '8:00 - 9:00 AM',
    room: '203',
    color: 'bg-indigo-500',
    students: 35
  },
  {
    id: 2,
    subject: 'Algebra & Trigonometry',
    teacher: 'Mr. Cruz',
    section: '10-Section A',
    time: '8:00 - 9:00 AM',
    room: '203',
    color: 'bg-orange-300',
    students: 35
  },
  {
    id: 3,
    subject: 'Algebra & Trigonometry',
    teacher: 'Mr. Cruz',
    section: '10-Section A',
    time: '8:00 - 9:00 AM',
    room: '203',
    color: 'bg-yellow-400',
    students: 35
  },
];


const MyClasses = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold">My Classes</Text>

        <TouchableOpacity onPress={() => navigation.navigate('TeacherClassesScreen')}>
          <Text className="font-bold text-green-600">Manage All</Text>
        </TouchableOpacity>
      </View>

      {/* Classes Container */}
      <View className="gap-3">
        {classes.map((item, i) => (
          <ClassCard key={i} {...item} />
        ))}
      </View>
    </View>
  );
};

export default MyClasses;
