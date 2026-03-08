import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { useAuth } from 'context/AuthContext';
import AuthNavigator from './AuthNavigator';
import StudentNavigator from './StudentNavigator';
import TeacherNavigator from './TeacherNavigator';
import { ClassProvider } from 'context/ClassContext';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function RootNavigator() {
  const { authResponse } = useAuth();

  if (!authResponse) {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <ClassProvider>
        {authResponse.data.userData.role === 'STUDENT' && <StudentNavigator />}
        {authResponse.data.userData.role === 'TEACHER' && <TeacherNavigator />}
      </ClassProvider>
    </NavigationContainer>
  );
}
