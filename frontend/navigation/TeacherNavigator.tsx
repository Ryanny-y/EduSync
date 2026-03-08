import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateClassScreen from 'screens/teacher/CreateClassScreen';
import EditClassScreen from 'screens/teacher/EditClassScreen';
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

      <Stack.Screen
        name="CreateClassScreen"
        component={CreateClassScreen}
      />

      <Stack.Screen
        name="EditClassScreen"
        component={EditClassScreen}
      />
    </Stack.Navigator>
  );
}