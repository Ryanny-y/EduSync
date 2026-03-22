import { ScrollView, View } from 'react-native';
import StudentDashboardHeader from './dashboard/StudentDashboardHeader';
import PendingWorks from './dashboard/PendingWorks';
import QuickActionCards from './dashboard/QuickActionCards';

const StudentDashboardScreen = () => {
  return (
    <View className="w-full flex-1 items-center justify-start px-4 pt-14 bg-background">
      <StudentDashboardHeader />

      <ScrollView
        className="w-full gap-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <PendingWorks />

        <QuickActionCards />
        {/* 3 Pending Works */}
        

      </ScrollView>
    </View>
  );
};

export default StudentDashboardScreen;
