import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from 'components/Header';
import TeacherClassCard from 'components/TeacherClassCard';
import Pressable from 'components/ui/Pressable';
import { Text } from 'components/ui/Text';
import { useAuth } from 'context/AuthContext';
import { useClassContext } from 'context/ClassContext';
import { BookOpen, Plus } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { TeacherStackParamList } from 'types/navigation';

type NavigationProps = NativeStackNavigationProp<TeacherStackParamList, 'CreateClassScreen'>;

const TeacherClassesScreen = () => {
  const { data, loading, refetchData } = useClassContext();
  const navigation = useNavigation<NavigationProps>();

  useFocusEffect(
    useCallback(() => {
      refetchData();
    }, [])
  );

  const classes = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  return (
    <View className="flex-1 bg-slate-50">
      <Header title="My Classes" />

      {!loading && classes.length === 0 ? (
        <View className="items-center px-10 py-24">
          <BookOpen size={48} color="#cbd5f5" />

          <Text className="mt-6 text-lg font-bold text-slate-700">No Classes Yet</Text>

          <Text className="mt-2 text-center text-sm text-slate-500">
            You haven't created any classes yet. Start by creating your first class and invite
            students to join.
          </Text>
        </View>
      ) : (
        <ScrollView
          className="px-4 pt-6"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}>
          {classes.map((item) => (
            <TeacherClassCard key={item.id} item={item} />
          ))}
        </ScrollView>
      )}

      {/* Create Class Button */}
      <Pressable
        onPress={() => navigation.navigate('CreateClassScreen')}
        className="absolute bottom-7 right-7 flex-row items-center gap-3 rounded-2xl bg-green-500 px-5 py-4 ">
        <Plus color="#ffffff" />
        <Text className="text-xl font-bold text-white">Create Class</Text>
      </Pressable>
    </View>
  );
};

export default TeacherClassesScreen;
