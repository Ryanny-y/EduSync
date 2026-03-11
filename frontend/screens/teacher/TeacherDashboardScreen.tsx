import { ScrollView, View } from 'react-native';
import TeacherDashboardHeader from './dashboard/TeacherDashboardHeader';
import MyClasses from './dashboard/MyClasses';

const TeacherDashboardScreen = () => {
  return (
    <View className="w-full flex-1 items-center justify-start bg-background px-4 py-14">
      <TeacherDashboardHeader />
      
      <ScrollView
        className="w-full gap-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <MyClasses />
      </ScrollView>
    </View>
  );
};

export default TeacherDashboardScreen;
