import { z } from "zod";
import { Role } from "../../generated/prisma";

export const createUserBodySchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required"),
    middleName: z.string().optional().default(""),
    lastName: z.string().min(1, "Last name is required"),
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

    department: z.string().optional(),
  }).refine(
      (data) => {
        if (data.role === "TEACHER") {
          return !!data.department;
        }
        return true;
      },
      {
        message: "department is required for teachers",
        path: ["department"],
      }
    )
});

export const loginUserBodySchema = z.object({
  body: z.object({
    email: z.email().min(1, "Email is required."),
    password: z.string().min(1, "Password is required.")
  })
})

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
  refreshToken: z.string().optional()
})