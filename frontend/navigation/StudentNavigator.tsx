import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentDashboardScreen from 'screens/student/StudentDashboardScreen';

// import SubjectsScreen from '../screens/student/SubjectsScreen';
// import RecitationScreen from '../screens/student/RecitationScreen';
// import NotificationsScreen from '../screens/shared/NotificationsScreen';

const Stack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="StudentDashboardScreen"
        component={StudentDashboardScreen}
      />

      {/* <Stack.Screen
        name="Subjects"
        component={SubjectsScreen}
      />

      <Stack.Screen
        name="Recitation"
        component={RecitationScreen}
      />

      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
      /> */}
    </Stack.Navigator>
  );
}