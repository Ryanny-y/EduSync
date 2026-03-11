import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddLessonScreen from 'screens/teacher/class-details/screens/AddLessonScreen';
import ClassDetailsScreen from 'screens/teacher/ClassDetailsScreen';
import CreateClassScreen from 'screens/teacher/my-class/CreateClassScreen';
import EditClassScreen from 'screens/teacher/my-class/EditClassScreen';
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

      <Stack.Screen
        name="ClassDetailsScreen"
        component={ClassDetailsScreen}
      />

      {/* LESSON DETAILS SCREEN RELATED */}
      <Stack.Screen
        name="AddLessonScreen"
        component={AddLessonScreen}
      />
    </Stack.Navigator>
  );
}