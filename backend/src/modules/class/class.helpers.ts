import { CustomError } from "../../common/utils/Errors";
import prismaClient from "../../config/client";
import { Role } from "../../generated/prisma";

export const verifyClassAccess = async (
  userId: string,
  role: Role,
  classId: string,
): Promise<void> => {
  if (role === "ADMIN") return;

  const hasAccess = await prismaClient.class.findFirst({
    where: {
      id: classId,
      OR: [{ teacherId: userId }, { students: { some: { id: userId } } }],
    },
    select: { id: true },
  });

  if (!hasAccess) {
    throw new CustomError(403, "Access denied");
  }
};


export const generateClassCode = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return Array.from({ length: 8 }, () =>
    chars.charAt(
      Math.floor(Math.random() * chars.length),
    ),
  ).join("");
};

export const generateBgColor = (): string => {
  const colors = [
    "#0891b2",
    "#059669",
    "#0d9488",
    "#3730a3",
    "#ca8a04",
    "#7f1d1d",
  ];
  return colors[Math.floor(Math.random() * colors.length)]!;
};
