import z from "zod";
import {
  submissionSchema,
  submissionListSchema,
  submissionStatusSchema,
  getSubmissionsQuerySchema,
  gradeSubmissionSchema,
  updateSubmissionFilesSchema,
} from "./submission.schema";
import { ApiResponse } from "../../common/types/api";

export type SubmissionStatus = z.infer<typeof submissionStatusSchema>;
export type SubmissionDto = z.infer<typeof submissionSchema>;
export type SubmissionListDto = z.infer<typeof submissionListSchema>;
export type GetSubmissionsQuery = z.infer<typeof getSubmissionsQuerySchema>["query"];
export type GradeSubmissionInput = z.infer<typeof gradeSubmissionSchema>["body"];
export type UpdateSubmissionFilesInput = z.infer<typeof updateSubmissionFilesSchema>["body"];

export interface SubmissionParams {
  classId?: string;
  workId?: string;
  submissionId?: string;
}

// Responses
export type GetSubmissionsResponse = ApiResponse<SubmissionListDto>;
export type GetSubmissionResponse = ApiResponse<SubmissionDto>;
export type GradeSubmissionResponse = ApiResponse<SubmissionDto>;
export type TurnInSubmissionResponse = ApiResponse<SubmissionDto>;
export type UnsubmitSubmissionResponse = ApiResponse<SubmissionDto>;
export type UpdateSubmissionFilesResponse = ApiResponse<SubmissionDto>;
export type DeleteSubmissionResponse = ApiResponse<void>;
