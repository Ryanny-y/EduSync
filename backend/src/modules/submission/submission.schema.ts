import { z } from "zod";
import { fileSchema, uploadedFileSchema } from "../file/file.schema";

// Status derived from turnedInAt, gradedAt, dueDate
export const submissionStatusSchema = z.enum([
  "PENDING",      // Not turned in, before due date
  "SUBMITTED",    // Turned in, not graded
  "GRADED",       // Has grade
  "LATE",         // Turned in after due date
  "MISSING",      // Not turned in, past due date
]);

export const submissionSchema = z.object({
  id: z.string(),
  studentId: z.string(),
  studentName: z.string(),
  workId: z.string(),
  workTitle: z.string(),
  status: submissionStatusSchema,
  turnedInAt: z.date().nullable(),
  gradedAt: z.date().nullable(),
  grade: z.number().nullable(),
  feedback: z.string().nullable(),
  files: z.array(
    z.object({
      id: z.string(),
      file: fileSchema,
    }),
  ),
  isLate: z.boolean(),
  createdAt: z.date(),
});

export const submissionListSchema = z.object({
  submissions: z.array(submissionSchema),
  stats: z.object({
    total: z.number(),
    pending: z.number(),
    submitted: z.number(),
    graded: z.number(),
    late: z.number(),
    missing: z.number(),
  }),
});

// Query schema for teacher filtering
export const getSubmissionsQuerySchema = z.object({
  query: z.object({
    status: z.enum(["ALL", "PENDING", "SUBMITTED", "GRADED", "LATE", "MISSING"]).optional().default("ALL"),
  }),
  params: z.object({
    classId: z.string().uuid(),
    workId: z.string().uuid(),
  }),
});

// Grade submission
export const gradeSubmissionSchema = z.object({
  body: z.object({
    grade: z.number().min(0).max(100),
    feedback: z.string().optional(),
  }),
  params: z.object({
    classId: z.string().uuid(),
    workId: z.string().uuid(),
    submissionId: z.string().uuid(),
  }),
});

// Student add/delete files
export const updateSubmissionFilesSchema = z.object({
  body: z.object({
    filesToDelete: z.array(z.string().uuid()).optional(),
  }),
  files: z.array(uploadedFileSchema).optional(),
});

// Params schemas
export const submissionParamsSchema = z.object({
  params: z.object({
    classId: z.string().uuid(),
    workId: z.string().uuid(),
    submissionId: z.string().uuid().optional(),
  }),
});

export const singleSubmissionParamsSchema = z.object({
  params: z.object({
    classId: z.string().uuid(),
    workId: z.string().uuid(),
    submissionId: z.string().uuid(),
  }),
});