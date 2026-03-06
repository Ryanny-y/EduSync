import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
    </Stack.Navigator>
  );
}