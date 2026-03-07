import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from 'components/ui/Text';
import { TouchableOpacity, View } from 'react-native';
import { TeacherStackParamList } from 'types/navigation';
import ClassCard from './ClassCard';

type NavigationProps = NativeStackNavigationProp<TeacherStackParamList, 'TeacherClassesScreen'>;

const classes = [
  {
    subject: 'Mathematics 101',
    title: 'Grade 10 - Newton',
    time: '11:00 AM - 12:00 PM',
    students: 35,
  },
  {
    subject: 'Mathematics 101',
    title: 'Grade 10 - Newton',
    time: '11:00 AM - 12:00 PM',
    students: 35,
  },
  {
    subject: 'Mathematics 101',
    title: 'Grade 10 - Newton',
    time: '11:00 AM - 12:00 PM',
    students: 35,
  },
  {
    subject: 'Mathematics 101',
    title: 'Grade 10 - Newton',
    time: '11:00 AM - 12:00 PM',
    students: 35,
  },
  {
    subject: 'Mathematics 101',
    title: 'Grade 10 - Newton',
    time: '11:00 AM - 12:00 PM',
    students: 35,
  },
  {
    subject: 'Mathematics 101',
    title: 'Grade 10 - Newton',
    time: '11:00 AM - 12:00 PM',
    students: 35,
  },
  {
    subject: 'Mathematics 101',
    title: 'Grade 10 - Newton',
    time: '11:00 AM - 12:00 PM',
    students: 35,
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
