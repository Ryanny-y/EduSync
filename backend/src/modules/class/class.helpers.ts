import { CustomError } from "../../common/utils/Errors";
import prismaClient from "../../config/client";

export const verifyClassAccess = async (
  userId: string,
  role: string,
  classId: string,
  requireTeacher = false,
): Promise<void> => {
  if (role === "ADMIN") return;

  const hasAccess = await prismaClient.class.findFirst({
    where: {
      id: classId,
      ...(requireTeacher
        ? { teacherId: userId }
        : {
            OR: [{ teacherId: userId }, { students: { some: { id: userId } } }],
          }),
    },
  });

  if (!hasAccess) {
    throw new CustomError(
      requireTeacher ? 403 : 404,
      requireTeacher
        ? "Only class teacher can perform this action"
        : "Class not found or access denied",
    );
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
