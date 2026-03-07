import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentClassesScreen from 'screens/student/StudentClassesScreen';
import StudentDashboardScreen from 'screens/student/StudentDashboardScreen';
import StudentWorksScreen from 'screens/student/StudentWorksScreen';

const Stack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="StudentDashboardScreen"
        component={StudentDashboardScreen}
      />

      <Stack.Screen 
        name="StudentWorksScreen"
        component={StudentWorksScreen}
      />

      <Stack.Screen 
        name="StudentClassesScreen"
        component={StudentClassesScreen}
      />
    </Stack.Navigator>
  );
}