import { UserRole } from "types/User";
import { IClass } from "./class";

export type AuthStackParamList = {
  WelcomeScreen: undefined;
  LoginScreen: { role: UserRole };
  SignupScreen: { role: UserRole };
  TeacherDashboardScreen: undefined;
  StudentDashboardScreen: undefined;
};

export type StudentStackParamList = {
  StudentWorksScreen: undefined;
  StudentClassesScreen: undefined;
  JoinClassScreen: undefined;
}

export type TeacherStackParamList = {
  TeacherClassesScreen: undefined;
  CreateClassScreen: undefined;
  EditClassScreen: { classData: IClass };
}