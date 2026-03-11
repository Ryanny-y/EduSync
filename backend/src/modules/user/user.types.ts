import z from "zod";
import { userDtoSchema } from "./user.schema";

export type UserDto = z.infer<typeof userDtoSchema>;

export type ClassStudentsDto = {
  students: Pick<UserDto, "id" | "firstName" | "middleName" | "lastName" | "email">[];
  totalStudents: number;
};