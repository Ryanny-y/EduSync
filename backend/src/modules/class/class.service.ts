import prismaClient from "../../config/client";
import { CustomError } from "../../common/utils/Errors";
import { CreateClassDto, UpdateClassDto, ClassDto } from "./class.types";
import { Prisma, Role } from "../../generated/prisma";

const generateClassCode = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let code = "";

  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};

const generateUniqueCode = async (): Promise<string> => {
  let code = generateClassCode();

  while (
    await prismaClient.class.findUnique({
      where: { code },
    })
  ) {
    code = generateClassCode();
  }

  return code;
};

export const createClass = async (
  teacherId: string,
  data: CreateClassDto
): Promise<ClassDto> => {
  const teacher = await prismaClient.user.findUnique({
    where: { id: teacherId },
  });

  if (!teacher) {
    throw new CustomError(404, "Teacher not found");
  }

  if (teacher.role !== Role.TEACHER) {
    throw new CustomError(403, "Only teachers can create classes");
  }

  const code = await generateUniqueCode();

  const created = await prismaClient.class.create({
    data: {
      ...data,
      code,
      teacherId,
      gmeetLink: data.gmeetLink ?? null
    },
  });

  return created;
};

export const getClasses = async (
  userId: string
): Promise<ClassDto[]> => {

  const user = await prismaClient.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new CustomError(404, "User not found");
  }

  if (user.role === "TEACHER") {
    return prismaClient.class.findMany({
      where: {
        teacherId: userId,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (user.role === "STUDENT") {
    return prismaClient.class.findMany({
      where: {
        students: {
          some: {
            id: userId,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Admin fallback (optional)
  return prismaClient.class.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getClassById = async (id: string): Promise<ClassDto> => {
  const found = await prismaClient.class.findUnique({
    where: { id },
  });

  if (!found) {
    throw new CustomError(404, "Class not found");
  }

  return found;
};

export const updateClass = async (
  teacherId: string,
  id: string,
  data: UpdateClassDto
): Promise<ClassDto> => {

  const existing = await prismaClient.class.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new CustomError(404, "Class not found");
  }

  if (existing.teacherId !== teacherId) {
    throw new CustomError(403, "Only the class owner can edit this class");
  }

  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  ) as Prisma.ClassUpdateInput;

  const updated = await prismaClient.class.update({
    where: { id },
    data: cleanData,
  });

  return updated;
};

export const deleteClass = async (
  teacherId: string,
  id: string
): Promise<void> => {
  const existing = await prismaClient.class.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new CustomError(404, "Class not found");
  }

  if (existing.teacherId !== teacherId) {
    throw new CustomError(403, "Only the class owner can delete this class");
  }

  await prismaClient.class.delete({
    where: { id },
  });
};