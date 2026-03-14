import prismaClient from "../../config/client";
import * as s3Service from "../../infra/storage/s3.service";
import { CreateWorkInput, WorkDto } from "./work.types";
import { verifyClassAccess } from "../class/class.helpers";
import { mapMimeTypeToFileType } from "../../common/utils/file-utils";
import { mapToWorkDto } from "./work.mapper";
import { CustomError } from "../../common/utils/Errors";

// Get all works in a class
export const getWorksByClassId = async (
  userId: string,
  role: string,
  classId: string,
): Promise<WorkDto[]> => {
  await verifyClassAccess(userId, role, classId);

  const works = await prismaClient.work.findMany({
    where: { classId },
    include: {
      materials: { include: { file: true } },
      _count: { select: { submissions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const worksWithUrls = await Promise.all(
    works.map(async (work) => ({
      ...work,
      materials: await Promise.all(
        work.materials.map(async (material) => ({
          ...material,
          file: {
            ...material.file,
            url: await s3Service.generatePresignedUrl(material.file.path),
          },
        })),
      ),
    })),
  );

  return worksWithUrls.map(mapToWorkDto);
};

// Get single work by ID
// export const getWorkById = async (
//   userId: string,
//   role: string,
//   classId: string,
//   workId: string,
// ): Promise<WorkDto> => {
//   await verifyClassAccess(userId, role, classId);

//   const work = await prismaClient.work.findFirst({
//     where: { id: workId, classId },
//     include: {
//       materials: { include: { file: true } },
//       _count: { select: { submissions: true } },
//     },
//   });

//   if (!work) {
//     throw new CustomError(404, "Work not found");
//   }

//   // Refresh URLs
//   work.materials = await Promise.all(
//     work.materials.map(async (material) => {
//       material.file = await s3Service.refreshPresignedUrlIfExpired(material.file);
//       return material;
//     }),
//   );

//   return mapToWorkDto(work);
// };

// Create work with materials
export const createWork = async (
  teacherId: string,
  classId: string,
  data: CreateWorkInput,
  files: Express.Multer.File[],
): Promise<WorkDto> => {
  await verifyClassAccess(teacherId, "TEACHER", classId, true);

  // Get all enrolled students before transaction
  const classWithStudents = await prismaClient.class.findUnique({
    where: { id: classId },
    include: { students: { select: { id: true } } },
  });

  if (!classWithStudents) {
    throw new CustomError(404, "Class not found");
  }

  const studentIds = classWithStudents.students.map((s) => s.id);

  const work = await prismaClient.$transaction(async (tx) => {
    // Create New Work
    const newWork = await tx.work.create({
      data: {
        title: data.title,
        description: data.description || null,
        type: data.type,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        classId,
      },
    });

    // Upload Materials
    if (files.length > 0) {
      for (const file of files) {
        const s3Result = await s3Service.uploadFile(
          file.buffer,
          file.originalname,
          file.mimetype,
          `classes/${classId}/works`,
        );

        const fileRecord = await tx.file.create({
          data: {
            fileName: file.originalname,
            fileType: mapMimeTypeToFileType(file.mimetype),
            path: s3Result.key,
            bucket: s3Result.bucket,
            url: s3Result.url,
            urlExpiresAt: new Date(Date.now() + 3600 * 1000),
            size: file.size,
          },
        });

        await tx.workMaterial.create({
          data: {
            workId: newWork.id,
            fileId: fileRecord.id,
          },
        });
      }
    }

    if (studentIds.length > 0) {
      await tx.submission.createMany({
        data: studentIds.map((studentId) => ({
          studentId,
          workId: newWork.id,
        })),
        skipDuplicates: true,
      });
    }

    return tx.work.findUnique({
      where: { id: newWork.id },
      include: {
        materials: { include: { file: true } },
        _count: { select: { submissions: true } },
      },
    });
  });

  return mapToWorkDto(work!);
};

// Update work
// export const updateWork = async (
//   teacherId: string,
//   classId: string,
//   workId: string,
//   data: UpdateWorkInput,
//   files: Express.Multer.File[]
// ): Promise<WorkDto> => {
//   await verifyClassAccess(teacherId, "TEACHER", classId, true);

//   const existing = await prismaClient.work.findFirst({
//     where: { id: workId, classId },
//     include: { materials: { include: { file: true } } },
//   });

//   if (!existing) {
//     throw new CustomError(404, "Work not found");
//   }

//   const work = await prismaClient.$transaction(async (tx) => {
//     // Update work fields
//     const updated = await tx.work.update({
//       where: { id: workId },
//       data: {
//         ...(data.title && { title: data.title }),
//         ...(data.description !== undefined && { description: data.description || null }),
//         ...(data.type && { type: data.type }),
//         ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
//       },
//     });

//     // Add new files if any
//     if (files.length > 0) {
//       for (const file of files) {
//         const s3Result = await s3Service.uploadFile(
//           file.buffer,
//           file.originalname,
//           file.mimetype,
//           `classes/${classId}/works`
//         );

//         const fileRecord = await tx.file.create({
//           data: {
//             fileName: file.originalname,
//             fileType: mapMimeTypeToEnum(file.mimetype),
//             path: s3Result.key,
//             bucket: s3Result.bucket,
//             url: s3Result.url,
//             urlExpiresAt: new Date(Date.now() + 3600 * 1000),
//             size: file.size,
//           },
//         });

//         await tx.workMaterial.create({
//           data: {
//             workId: updated.id,
//             fileId: fileRecord.id,
//           },
//         });
//       }
//     }

//     return tx.work.findUnique({
//       where: { id: workId },
//       include: {
//         materials: { include: { file: true } },
//         _count: { select: { submissions: true } },
//       },
//     });
//   });

//   return mapToWorkDto(work!);
// };

// Delete work
export const deleteWork = async (
  teacherId: string,
  classId: string,
  workId: string,
): Promise<void> => {
  await verifyClassAccess(teacherId, "TEACHER", classId, true);

  const work = await prismaClient.work.findFirst({
    where: { id: workId, classId },
    include: { materials: { include: { file: true } } },
  });

  if (!work) {
    throw new CustomError(404, "Work not found");
  }

  const keys = work.materials.map((m) => m.file.path);

  await prismaClient.$transaction(async (tx) => {
    for (const material of work.materials) {
      await tx.workMaterial.delete({
        where: { id: material.id },
      });

      await tx.file.delete({
        where: { id: material.file.id },
      });
    }

    // delete submissions first
    await tx.submission.deleteMany({
      where: { workId },
    });

    await tx.work.delete({
      where: { id: workId },
    });
  });

  // Delete from S3 after the transaction
  for (const key of keys) {
    await s3Service.deleteFile(key);
  }
};

// Delete specific material from work
// export const deleteWorkMaterial = async (
//   teacherId: string,
//   classId: string,
//   workId: string,
//   materialId: string
// ): Promise<void> => {
//   await verifyClassAccess(teacherId, "TEACHER", classId, true);

//   const material = await prismaClient.workMaterial.findFirst({
//     where: { id: materialId, workId },
//     include: { file: true, work: true },
//   });

//   if (!material) {
//     throw new CustomError(404, "Material not found");
//   }

//   if (material.work.classId !== classId) {
//     throw new CustomError(403, "Access denied");
//   }

//   await prismaClient.$transaction(async (tx) => {
//     await s3Service.deleteFile(material.file.path);
//     await tx.file.delete({ where: { id: material.file.id } });
//     await tx.workMaterial.delete({ where: { id: materialId } });
//   });
// };
