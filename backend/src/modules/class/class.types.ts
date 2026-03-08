import z from "zod";
import { ApiResponse } from "../../common/types/api";
import {
  createClassBodySchema,
  updateClassBodySchema,
  classDtoSchema,
  joinClassBodySchema,
} from "./class.schema";

export type ClassDto = z.infer<typeof classDtoSchema>;

export type CreateClassDto = z.infer<typeof createClassBodySchema>["body"];
export type UpdateClassDto = z.infer<typeof updateClassBodySchema>["body"];
export type JoinClassDto = z.infer<typeof joinClassBodySchema>["body"];

export type CreateClassResponse = ApiResponse<ClassDto>;
export type GetClassesResponse = ApiResponse<ClassDto[]>;
export type GetClassResponse = ApiResponse<ClassDto>;
export type UpdateClassResponse = ApiResponse<ClassDto>;
export type DeleteClassResponse = ApiResponse<void>;
export type JoinClassResponse = ApiResponse<ClassDto>;