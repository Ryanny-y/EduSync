import { useAuth } from 'context/AuthContext';
import { ScrollView, View } from 'react-native';
import StudentDashboardHeader from './dashboard/StudentDashboardHeader';
import PendingWorks from './dashboard/PendingWorks';

const StudentDashboardScreen = () => {
  const { user, logout } = useAuth();

  return (
    <View className="w-full flex-1 items-center justify-start px-5 py-14">
      <StudentDashboardHeader />

      <ScrollView
        className="w-full"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 3 Pending Works */}
        <PendingWorks />
        
        
      </ScrollView>
    </View>
  );
};

export default StudentDashboardScreen;
