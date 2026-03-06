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
  department?: string;
}

export interface IUser extends HasId {
  firstName: string,
  middleName: string,
  lastName: string,
  email: string,
  role: UserRole,
}