import z from "zod";
import { ApiResponse } from "../../common/types/api";
import {
  createDepartmentBodySchema,
  updateDepartmentBodySchema,
  departmentDtoSchema,
} from "./department.schema";

export type DepartmentDto = z.infer<typeof departmentDtoSchema>;

export type CreateDepartmentDto = z.infer<typeof createDepartmentBodySchema>["body"];
export type UpdateDepartmentDto = z.infer<typeof updateDepartmentBodySchema>["body"];

export type CreateDepartmentResponse = ApiResponse<DepartmentDto>;
export type GetDepartmentsResponse = ApiResponse<DepartmentDto[]>;
export type GetDepartmentResponse = ApiResponse<DepartmentDto>;
export type UpdateDepartmentResponse = ApiResponse<DepartmentDto>;
export type DeleteDepartmentResponse = ApiResponse<void>;