import { UserRole } from 'types/user';
import { IClass } from './class';
import { ILesson } from './lesson';
import { IWork } from './work';

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
  ClassDetailsScreen: { classId: string };

  // Lessons
  LessonsScreen: { classId: string };
  LessonDetailsScreen: { lesson: ILesson };

  // WORKS
  WorksScreen: { classId: string };
  WorkDetailsScreen: { classId: string, workId: string };
};

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
  WorkDetailsScreen: { work: IWork };
};
