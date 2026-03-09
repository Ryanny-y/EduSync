import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from 'components/Header';
import { Text } from 'components/ui/Text';
import { useClassContext } from 'context/ClassContext';
import { BookOpen, Plus } from 'lucide-react-native';
import { useCallback, useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { StudentStackParamList } from 'types/navigation';
import StudentClassCard from 'components/StudentClassCard';

type NavigationProps = NativeStackNavigationProp<StudentStackParamList, 'JoinClassScreen'>;

const StudentClassesScreen = () => {
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
            You're not enrolled in any classes yet. Join a class to start learning with your
            teacher.
          </Text>
        </View>
      ) : (
        <ScrollView
          className="px-4 pt-6"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}>
          {classes.map((item) => (
            <StudentClassCard key={item.id} item={item} refetchData={refetchData} />
          ))}
        </ScrollView>
      )}

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
