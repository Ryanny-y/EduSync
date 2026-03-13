import { UserRole } from "types/user";
import { IClass } from "./class";
import { ILesson } from "./lesson";

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
  ClassDetailsScreen: { classId: string };
  // LESSON
  LessonDetailsScreen: { lesson: ILesson };
  AddLessonScreen: { classId: string };
  EditLessonScreen: { lesson: ILesson };
  // WORKS
  CreateWorkScreen: { classId: string };
}