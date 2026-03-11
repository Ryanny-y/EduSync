import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text } from 'components/ui/Text';
import { View } from 'react-native';
import { TeacherStackParamList } from 'types/navigation';
import ClassCard from './ClassCard';
import Pressable from 'components/ui/Pressable';
import { useClassContext } from 'context/ClassContext';
import { useMemo } from 'react';
import { BookOpen } from 'lucide-react-native';

type NavigationProps = NativeStackNavigationProp<TeacherStackParamList, 'TeacherClassesScreen'>;

const MyClasses = () => {
  const navigation = useNavigation<NavigationProps>();
  // TODO: Handle Loading and Error
  const { data, loading, refetchData } = useClassContext();

  const classes = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-xl font-bold">My Classes</Text>

        <Pressable onPress={() => navigation.navigate('TeacherClassesScreen')}>
          <Text className="font-bold text-green-600">Manage All</Text>
        </Pressable>
      </View>

      {/* Classes Container */}
      {!loading && classes.length == 0 ? (
        <View className="items-center px-10 py-24">
          <BookOpen size={48} color="#cbd5f5" />

          <Text className="mt-6 text-lg font-bold text-slate-700">No Classes Yet</Text>

          <Text className="mt-2 text-center text-sm text-slate-500">
            You haven't created any classes yet. Start by creating your first class and invite
            students to join.
          </Text>
        </View>
      ) : (
        <View className="gap-3">
          {classes.map((item, i) => (
            <ClassCard key={i} {...item} />
          ))}
        </View>
      )}

    </View>
  );
};

export default MyClasses;
