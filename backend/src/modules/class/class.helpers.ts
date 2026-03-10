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