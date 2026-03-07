import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TeacherClassesScreen from 'screens/teacher/TeacherClassesScreen';
import TeacherDashboardScreen from 'screens/teacher/TeacherDashboardScreen';


const Stack = createNativeStackNavigator();

export default function TeacherNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="TeacherDashboard"
        component={TeacherDashboardScreen}
      />

      <Stack.Screen
        name="TeacherClassesScreen"
        component={TeacherClassesScreen}
      />

      {/* <Stack.Screen
        name="ViewSummary"
        component={ViewSummaryScreen}
      />

      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
      /> */}
    </Stack.Navigator>
  );
}