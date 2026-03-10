import { HasId } from "./common";

export type UserRole = "TEACHER" | "STUDENT";

export interface CreateUserForm {
  firstName: string,
  middleName: string,
  lastName: string,
  email: string,
  role: UserRole,
  password: string;
  confirmPassword: string;
  departmentId?: string;
}

export interface IUser extends HasId {
  firstName: string,
  middleName: string,
  lastName: string,
  email: string,
  role: UserRole,
}

export interface ClassStudentsDto {
  students: Pick<UserDto, "id" | "firstName" | "middleName" | "lastName" | "email">[];
  totalStudents: number;
}