import { z } from "zod";
import { createLessonSchema, lessonSchema } from "./lesson.schema";
import { ApiResponse } from "../../common/types/api";

export type LessonDto = z.infer<typeof lessonSchema>;

export type CreateLessonDto = z.infer<typeof createLessonSchema>["body"];
export type DeleteLessonResponse = ApiResponse<void>;

export type GetLessonsResponse = ApiResponse<LessonDto[]>;
export type GetLessonResponse = ApiResponse<LessonDto>;
export type CreateLessonResponse = ApiResponse<LessonDto>;