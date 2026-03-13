import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LessonDetailsScreen from 'screens/student/class-details/LessonDetailsScreen';
import LessonsScreen from 'screens/student/class-details/LessonsScreen';
import ClassDetailsScreen from 'screens/student/ClassDetailsScreen';
import JoinClassScreen from 'screens/student/JoinClassScreen';
import StudentClassesScreen from 'screens/student/StudentClassesScreen';
import StudentDashboardScreen from 'screens/student/StudentDashboardScreen';
import StudentWorksScreen from 'screens/student/StudentWorksScreen';

const Stack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StudentDashboardScreen" component={StudentDashboardScreen} />

      <Stack.Screen name="StudentWorksScreen" component={StudentWorksScreen} />

      <Stack.Screen name="StudentClassesScreen" component={StudentClassesScreen} />

      <Stack.Screen name="JoinClassScreen" component={JoinClassScreen} />

      <Stack.Screen name="ClassDetailsScreen" component={ClassDetailsScreen} />

      {/* Lessons */}
      <Stack.Screen name="LessonsScreen" component={LessonsScreen} />
      <Stack.Screen name="LessonDetailsScreen" component={LessonDetailsScreen} />

    </Stack.Navigator>
  );
}
