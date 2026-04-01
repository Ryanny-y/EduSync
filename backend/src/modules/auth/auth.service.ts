import prismaClient from "../../config/client";
import bcrypt from "bcrypt";
import {
  AuthResponseDto,
  CreateUserDto,
  LoginUserDto,
  UserDto,
} from "./auth.types";
import { Role } from "@prisma/client";
import { CustomError } from "../../common/utils/Errors";
import jwt from "jsonwebtoken";
import { addDays } from "date-fns";
import { generateVerificationCode } from "../../utils/generateVerificationCode";
import { addMinutes } from "date-fns";
import { sendVerificationEmail } from "../../infra/email/email.service";

export const createUser = async (data: CreateUserDto): Promise<UserDto> => {
  const {
    id,
    firstName,
    middleName = "",
    lastName,
    email,
    password,
    confirmPassword,
    role,
    departmentId,
  } = data;

  const normalizedEmail = email.toLowerCase();

  // Check if user exists
  const existingUser = await prismaClient.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw new CustomError(409, "User already exists");
  }

  if (password !== confirmPassword) {
    throw new CustomError(400, "Passwords do not match.");
  }

  if (role === "STUDENT" && !id) {
    throw new CustomError(400, "Student Number is required");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const code = generateVerificationCode();
  const hashedCode = await bcrypt.hash(code, 10);

  // Create user
  const createdUser = await prismaClient.user.create({
    data: {
      ...(id && { id }),
      firstName,
      middleName,
      lastName,
      email: normalizedEmail,
      verificationCodeHash: hashedCode,
      verificationCodeExpires: addMinutes(new Date(), 10),
      isVerified: false,
      passwordHash: hashedPassword,
      role: role as Role,
      ...(departmentId ? { departmentId } : {}),
    },
    include: {
      department: true,
    },
  });

  await sendVerificationEmail(createdUser.email, code);

  return {
    id: createdUser.id,
    firstName: createdUser.firstName,
    middleName: createdUser.middleName || "",
    lastName: createdUser.lastName,
    email: createdUser.email,
    role: createdUser.role,
    department: createdUser.department?.name ?? undefined,
  };
};

export const login = async (data: LoginUserDto): Promise<AuthResponseDto> => {
  const { email, password } = data;

  const foundUser = await prismaClient.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!foundUser) throw new CustomError(401, "Email or password is incorrect.");

  const match = await bcrypt.compare(password, foundUser.passwordHash);
  if (!match) throw new CustomError(401, "Email or password is incorrect.");

  if (foundUser.role !== data.role) {
    throw new CustomError(
      403,
      `You are not registered as ${data.role.toLowerCase()}`,
    );
  }

  if (!foundUser?.isVerified)
    throw new CustomError(
      403,
      "User is not yet verified. Please verify your account first.",
    );

  // CREATE JWTS
  const accessToken = jwt.sign(
    {
      sub: foundUser.id,
      role: foundUser.role,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    {
      sub: foundUser.id,
      role: foundUser.role,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" },
  );

  // HASH PASSWORD BEFORE STORING IN THE DATABASE
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  await prismaClient.user.update({
    where: {
      id: foundUser.id,
    },
    data: {
      refreshTokenHash: hashedRefreshToken,
      refreshTokenExpiresAt: addDays(new Date(), 7),
    },
  });

  return {
    userData: {
      id: foundUser.id,
      firstName: foundUser.firstName,
      middleName: foundUser.middleName || "",
      lastName: foundUser.lastName,
      email: foundUser.email,
      role: foundUser.role,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshToken = async (
  refreshToken: string,
): Promise<AuthResponseDto> => {
  let payload: any;

  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch {
    throw new CustomError(401, "Unauthorized");
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: payload.sub,
    },
  });

  if (!user || !user?.refreshTokenHash)
    throw new CustomError(401, "Unauthorized");

  const isSameToken = await bcrypt.compare(refreshToken, user.refreshTokenHash);

  if (
    !user.refreshTokenExpiresAt ||
    !isSameToken ||
    user.refreshTokenExpiresAt.getTime() < Date.now()
  ) {
    throw new CustomError(401, "Unauthorized");
  }

  const newAccessToken = jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "15m" },
  );

  return {
    userData: {
      id: user.id,
      firstName: user.firstName,
      middleName: user.middleName || "",
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    accessToken: newAccessToken,
  };
};

export const logout = async (refreshToken: string): Promise<void> => {
  let payload: any;

  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch {
    return;
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: payload.sub,
    },
    select: {
      refreshTokenHash: true,
    },
  });

  if (!user || !user.refreshTokenHash) {
    return;
  }

  const isValid = await bcrypt.compare(refreshToken, user.refreshTokenHash);

  if (!isValid) {
    return;
  }

  await prismaClient.user.update({
    where: {
      id: payload.sub,
    },
    data: {
      refreshTokenHash: null,
      refreshTokenExpiresAt: null,
    },
  });
};

// VERIFICATION CODE
export const sendVerificationCode = async (email: string) => {
  const normalizedEmail = email.toLowerCase();

  const user = await prismaClient.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new CustomError(404, "User not found");
  }

  const code = generateVerificationCode();

  const hashedCode = await bcrypt.hash(code, 10);

  await prismaClient.user.update({
    where: { id: user.id },
    data: {
      verificationCodeHash: hashedCode,
      verificationCodeExpires: addMinutes(new Date(), 10),
    },
  });

  await sendVerificationEmail(user.email, code);

  return {
    message: "Verification code sent to email",
  };
};

export const verifyEmailCode = async (email: string, code: string) => {
  const user = await prismaClient.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (user?.isVerified) {
    throw new CustomError(409, "User is already verified.");
  }

  if (!user || !user.verificationCodeHash) {
    throw new CustomError(400, "Invalid code");
  }

  const isValid = await bcrypt.compare(code, user.verificationCodeHash);

  if (
    !isValid ||
    !user.verificationCodeExpires ||
    user.verificationCodeExpires.getTime() < Date.now()
  ) {
    throw new CustomError(400, "Code expired or invalid");
  }

  await prismaClient.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationCodeHash: null,
      verificationCodeExpires: null,
    },
  });

  return {
    message: "Email verified successfully",
  };
};
