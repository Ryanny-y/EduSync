import { Text } from 'components/ui/Text';
import { View } from 'react-native';
import TeacherDashboardHeader from './dashboard/TeacherDashboardHeader';

const TeacherDashboardScreen = () => {
  return (
    <View className="w-full flex-1 items-center justify-start bg-background px-4 py-14">
      <TeacherDashboardHeader />
    </View>
  );
};

export default TeacherDashboardScreen;
