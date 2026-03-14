import z from "zod";
import { createWorkSchema, updateWorkSchema, workSchema } from "./work.schema";
import { ApiResponse } from "../../common/types/api";
import { WorkType } from "../../generated/prisma";

export interface StudentWorkDto {
  id: string;
  title: string;
  type: WorkType;
  description: string | null;
  dueDate: Date | null;
  classId: string;
  submissionStatus: string;
};

export type WorkDto = z.infer<typeof workSchema>;
export type CreateWorkInput = z.infer<typeof createWorkSchema>["body"];
export type UpdateWorkInput = z.infer<typeof updateWorkSchema>["body"];

export interface WorkParams {
  classId?: string;
  workId?: string;
  materialId?: string;
}

// Responses
export type GetStudentWorksResponse = ApiResponse<StudentWorkDto[]>;
export type GetWorksResponse = ApiResponse<WorkDto[]>;
export type GetWorkResponse = ApiResponse<WorkDto>;
