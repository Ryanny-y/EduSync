import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TeacherDashboardScreen from 'screens/teacher/TeacherDashboardScreen';


const Stack = createNativeStackNavigator();

export default function TeacherNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="TeacherDashboard"
        component={TeacherDashboardScreen}
      />

      {/* <Stack.Screen
        name="UploadLesson"
        component={UploadLessonScreen}
      />

      <Stack.Screen
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