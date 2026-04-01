import z from "zod";
import { ApiResponse } from "../../common/types/api";
import {
  authResponseSchema,
  createUserBodySchema,
  loginUserBodySchema,
  refreshTokenCookieSchema,
  sendVerificationCodeSchema,
  userDtoSchema,
  verifyEmailSchema,
} from "./auth.schema";

export type UserDto = z.infer<typeof userDtoSchema>;
export type AuthResponseDto = z.infer<typeof authResponseSchema>;

export type RefreshTokenCookies = z.infer<typeof refreshTokenCookieSchema>;

export type CreateUserDto = z.infer<typeof createUserBodySchema>["body"];
export type LoginUserDto = z.infer<typeof loginUserBodySchema>["body"];

// Responses
export type CreateUserResponse = ApiResponse<UserDto>;
export type LoginResponse = ApiResponse<AuthResponseDto>;
export type RefreshTokenResponse = ApiResponse<AuthResponseDto>;
export type LogoutResponse = ApiResponse<void>;

//
export type sendVerificationCodeDto = z.infer<
  typeof sendVerificationCodeSchema
>["body"];
export type verifyEmailDto = z.infer<typeof verifyEmailSchema>["body"];
