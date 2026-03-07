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

export const createClass = async (
  teacherId: string,
  role: Role,
  data: CreateClassDto,
): Promise<ClassDto> => {
  if (role !== Role.TEACHER) {
    throw new CustomError(403, "Only teachers can create classes");
  }

  for (let i = 0; i < 5; i++) {
    const code = generateClassCode();
    try {
      const created = await prismaClient.class.create({
        data: {
          ...data,
          code,
          teacherId,
          gmeetLink: data.gmeetLink ?? null
        },
      });

      return created;

    } catch (error: any) {

      if (error.code === "P2002") {
        continue; // duplicate code → retry
      }

      throw error;
    }
  }

  throw new CustomError(500, "Failed to generate class code");
};

export const getClasses = async (
  userId: string,
  role: Role,
): Promise<ClassDto[]> => {
  if (role === "TEACHER") {
    return prismaClient.class.findMany({
      where: {
        teacherId: userId,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  if (role === "STUDENT") {
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

export const getClassById = async (
  userId: string,
  role: Role,
  classId: string,
): Promise<ClassDto> => {
  if (role === "ADMIN") {
    const cls = await prismaClient.class.findUnique({
      where: { id: classId }
    });

    if (!cls) {
      throw new CustomError(404, "Class not found");
    }

    return cls;
  }

  const cls = await prismaClient.class.findFirst({
    where: {
      id: classId,
      OR: [{ teacherId: userId }, { students: { some: { id: userId } } }],
    },
  });

  if (!cls) {
    throw new CustomError(404, "Class not found");
  }

  return cls;
};

export const updateClass = async (
  teacherId: string,
  id: string,
  data: UpdateClassDto,
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
    Object.entries(data).filter(([, v]) => v !== undefined),
  ) as Prisma.ClassUpdateInput;

  const updated = await prismaClient.class.update({
    where: { id },
    data: cleanData,
  });

  return updated;
};

export const deleteClass = async (
  teacherId: string,
  id: string,
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
