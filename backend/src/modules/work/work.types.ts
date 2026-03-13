import z from "zod";
import { createWorkSchema, updateWorkSchema, workSchema } from "./work.schema";
import { ApiResponse } from "../../common/types/api";

export type WorkDto = z.infer<typeof workSchema>;
export type CreateWorkInput = z.infer<typeof createWorkSchema>["body"];
export type UpdateWorkInput = z.infer<typeof updateWorkSchema>["body"];

export interface WorkParams {
  classId?: string;
  workId?: string;
  materialId?: string;
}

  
// Responses
export type GetWorksResponse = ApiResponse<WorkDto[]>;
export type GetWorkResponse = ApiResponse<WorkDto>;