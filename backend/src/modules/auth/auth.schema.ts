import { z } from "zod";
import { Role } from "@prisma/client";

const nameRegex = /^[A-Za-z\s'-]+$/;

export const createUserBodySchema = z.object({
  body: z
    .object({
      id: z
        .string()
        .regex(/^\d{11}$/, "ID must be exactly 11 digits")
        .optional(),

      firstName: z
        .string()
        .min(1, "First name is required")
        .regex(
          nameRegex,
          "First name can only contain letters, spaces, hyphens, and apostrophes",
        ),

      middleName: z
        .string()
        .regex(
          nameRegex,
          "Middle name can only contain letters, spaces, hyphens, and apostrophes",
        )
        .optional()
        .default(""),

      lastName: z
        .string()
        .min(1, "Last name is required")
        .regex(
          nameRegex,
          "Last name can only contain letters, spaces, hyphens, and apostrophes",
        ),

      email: z.email("Invalid email address").min(1, "Email is required"),

      password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[0-9]/, "Must contain a number"),

      confirmPassword: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[0-9]/, "Must contain a number"),

      role: z.enum(Role),

      departmentId: z.uuid().optional(),
    })
    .refine(
      (data) => {
        if (data.role === "TEACHER") {
          return !!data.departmentId;
        }
        return true;
      },
      {
        message: "department is required for teachers",
        path: ["department"],
      },
    ),
});

export const loginUserBodySchema = z.object({
  body: z.object({
    email: z.email().min(1, "Email is required."),
    password: z.string().min(1, "Password is required."),
    role: z.enum(Role),
  }),
});

export const refreshTokenCookieSchema = z.object({
  cookies: z.object({
    refresh_token: z.string(),
  }),
});

export const userDtoSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().optional(),
  department: z.string().optional(),
  email: z.email(),
  role: z.enum(Role),
});

export const authResponseSchema = z.object({
  userData: userDtoSchema,
  accessToken: z.string(),
  refreshToken: z.string().optional(),
});

export const sendVerificationCodeSchema = z.object({
  body: z.object({
    email: z.email().min(1, "Email is required."),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.email().min(1, "Email is required."),
    code: z.string().length(6),
  }),
});
