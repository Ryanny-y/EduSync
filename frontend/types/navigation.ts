import { UserRole } from "types/User";

export type AuthStackParamList = {
  WelcomeScreen: undefined;
  LoginScreen: { role: UserRole };
  SignupScreen: { role: UserRole };
  TeacherDashboardScreen: undefined;
  StudentDashboardScreen: undefined;
};

export type StudentStackParamList = {
  StudentWorksScreen: undefined
}