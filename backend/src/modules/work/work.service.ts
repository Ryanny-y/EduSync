import prismaClient from "../../config/client";
import { CustomError } from "../../common/utils/Errors";
import * as s3Service from "../../infra/storage/s3.service";
import { CreateWorkInput, UpdateWorkInput, WorkDto } from "./work.types";
import { verifyClassAccess } from "../class/class.helpers";

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

  // Refresh presigned URLs if expired
  const worksWithFreshUrls = await Promise.all(
    works.map(async (work) => {
      work.materials = await Promise.all(
        work.materials.map(async (material) => {
          material.file = await s3Service.refreshPresignedUrlIfExpired(
            material.file,
          );
          return material;
        }),
      );
      return work;
    }),
  );

  return worksWithFreshUrls.map(mapToWorkDto);
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
// export const createWork = async (
//   teacherId: string,
//   classId: string,
//   data: CreateWorkInput,
//   files: Express.Multer.File[]
// ): Promise<WorkDto> => {
//   await verifyClassAccess(teacherId, "TEACHER", classId, true);

//   const work = await prismaClient.$transaction(async (tx) => {
//     const newWork = await tx.work.create({
//       data: {
//         title: data.title,
//         description: data.description || null,
//         type: data.type,
//         dueDate: data.dueDate ? new Date(data.dueDate) : null,
//         classId,
//       },
//     });

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
//             workId: newWork.id,
//             fileId: fileRecord.id,
//           },
//         });
//       }
//     }

//     return tx.work.findUnique({
//       where: { id: newWork.id },
//       include: {
//         materials: { include: { file: true } },
//         _count: { select: { submissions: true } },
//       },
//     });
//   });

//   return mapToWorkDto(work!);
// };

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
// export const deleteWork = async (
//   teacherId: string,
//   classId: string,
//   workId: string
// ): Promise<void> => {
//   await verifyClassAccess(teacherId, "TEACHER", classId, true);

//   const work = await prismaClient.work.findFirst({
//     where: { id: workId, classId },
//     include: { materials: { include: { file: true } } },
//   });

//   if (!work) {
//     throw new CustomError(404, "Work not found");
//   }

//   await prismaClient.$transaction(async (tx) => {
//     // Delete from S3
//     for (const material of work.materials) {
//       await s3Service.deleteFile(material.file.path);
//       await tx.file.delete({ where: { id: material.file.id } });
//     }

//     await tx.work.delete({ where: { id: workId } });
//   });
// };

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

// Helper: Map to DTO
function mapToWorkDto(work: any): WorkDto {
  return {
    id: work.id,
    title: work.title,
    description: work.description,
    type: work.type,
    dueDate: work.dueDate,
    classId: work.classId,
    createdAt: work.createdAt,
    updatedAt: work.updatedAt,
    materials:
      work.materials?.map((m: any) => ({
        id: m.id,
        fileName: m.file.fileName,
        fileType: m.file.fileType,
        s3Key: m.file.path,
        url: m.file.url,
        size: m.file.size,
      })) || [],
    submissionCount: work._count?.submissions || 0,
  };
}
