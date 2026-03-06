import { useAuth } from 'context/AuthContext';
import { ScrollView, View } from 'react-native';
import StudentDashboardHeader from './dashboard/StudentDashboardHeader';
import PendingWorks from './dashboard/PendingWorks';
import { BookOpen, MessageSquare } from 'lucide-react-native';
import { Text } from 'components/ui/Text';
import QuickActionCards from './dashboard/QuickActionCards';

const StudentDashboardScreen = () => {
  const { user, logout } = useAuth();

  return (
    <View className="w-full flex-1 items-center justify-start px-5 py-14 bg-background">
      <StudentDashboardHeader />

      <ScrollView
        className="w-full gap-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 3 Pending Works */}
        <PendingWorks />
        
        <QuickActionCards />

      </ScrollView>
    </View>
  );
};

export default StudentDashboardScreen;
