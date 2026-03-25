import { z } from "zod";

export const createClassBodySchema = z.object({
  body: z.object({
    name: z.string().min(1),
    subject: z.string().min(1),
    section: z.string().min(1),
    time: z.string().min(1),
    room: z.string().min(1),
    gmeetLink: z.url().optional(),
  }),
});

export const updateClassBodySchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    subject: z.string().min(1).optional(),
    section: z.string().min(1).optional(),
    time: z.string().min(1).optional(),
    room: z.string().min(1).optional(),
    gmeetLink: z.url().optional(),
  }),
  params: z.object({
    id: z.uuid(),
  }),
});

export const classParamsSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

export const classDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  subject: z.string(),
  section: z.string(),
  time: z.string(),
  room: z.string(),
  gmeetLink: z.string().nullable(),
  code: z.string(),
  teacher: z.string(),
  teacherId: z.string(),
  studentCount: z.number(),
  bgColor: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const joinClassBodySchema = z.object({
  body: z.object({
    code: z.string().min(8),
  }),
});

export const unenrollClassParamsSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
  body: z.object({
    studentId: z.string().optional(),
  })
});