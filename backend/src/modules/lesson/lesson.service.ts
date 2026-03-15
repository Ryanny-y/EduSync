import prismaClient from "../../config/client";
import { CustomError } from "../../common/utils/Errors";
import * as s3Service from "../../infra/storage/s3.service";
import { CreateLessonDto, LessonDto } from "./lesson.types";
import { mapLessonToDto } from "./lesson.mapper";
import { verifyClassAccess } from "../class/class.helpers";
import { Role } from "@prisma/client";
import { mapMimeTypeToFileType } from "../../common/utils/file-utils";

export const getLessonsByClassId = async (
  userId: string,
  role: Role,
  classId: string,
): Promise<LessonDto[]> => {
  await verifyClassAccess(userId, role, classId);

  const lessons = await prismaClient.lesson.findMany({
    where: { classId },
    include: {
      materials: {
        include: {
          file: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const lessonsWithUrls = [];

  for (const lesson of lessons) {
    const materials = [];

    for (const material of lesson.materials) {
      const url = await s3Service.generatePresignedUrl(material.file.path);

      materials.push({
        ...material,
        file: {
          ...material.file,
          url,
        },
      });
    }

    lessonsWithUrls.push({
      ...lesson,
      materials,
    });
  }
  
  return lessonsWithUrls.map(mapLessonToDto);
};

// Upload lesson with materials
export const createLesson = async (
  teacherId: string,
  classId: string,
  data: CreateLessonDto,
  files: Express.Multer.File[],
): Promise<LessonDto> => {
  // Verify teacher owns the class
  const classData = await prismaClient.class.findUnique({
    where: { id: classId },
  });

  if (!classData) {
    throw new CustomError(404, "Class not found");
  }

  if (classData.teacherId !== teacherId) {
    throw new CustomError(403, "Only class teacher can create lessons");
  }

  // Upload files to Google Drive and create lesson in transaction
  const lesson = await prismaClient.$transaction(async (tx) => {
    // Create lesson
    const newLesson = await tx.lesson.create({
      data: {
        title: data.title,
        classId,
      },
    });

    // Upload files and create materials
    for (const file of files) {
      // Upload to Google Drive
      const s3Result = await s3Service.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        `classes/${classId}/lessons`, // Organized folder structure
      );

      // Create file record
      const fileRecord = await tx.file.create({
        data: {
          fileName: file.originalname,
          fileType: mapMimeTypeToFileType(file.mimetype),
          path: s3Result.key, // S3 Key
          bucket: s3Result.bucket, // Bucket name
          url: s3Result.url, // Presigned URL
          urlExpiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
          size: file.size,
        },
      });

      // Create lesson material link
      await tx.lessonMaterial.create({
        data: {
          lessonId: newLesson.id,
          fileId: fileRecord.id,
        },
      });
    }

    return tx.lesson.findUnique({
      where: { id: newLesson.id },
      include: {
        materials: { include: { file: true } },
      },
    });
  });

  return mapLessonToDto(lesson);
};

// Delete lesson and materials
export const deleteLesson = async (
  teacherId: string,
  lessonId: string,
): Promise<void> => {
  const lesson = await prismaClient.lesson.findUnique({
    where: { id: lessonId },
    include: {
      class: true,
      materials: { include: { file: true } },
    },
  });

  if (!lesson) {
    throw new CustomError(404, "Lesson not found");
  }

  if (lesson.class.teacherId !== teacherId) {
    throw new CustomError(403, "Only class teacher can delete lessons");
  }

  const keys = lesson.materials.map((m) => m.file.path);

  // Delete files from Google Drive and database
  await prismaClient.$transaction(async (tx) => {
    // Delete from S3
    for (const material of lesson.materials) {
      await tx.lessonMaterial.delete({
        where: { id: material.id },
      });

      await tx.file.delete({ where: { id: material.file.id } });
    }

    await tx.lesson.delete({ where: { id: lessonId } });
  });

  for (const key of keys) {
    await s3Service.deleteFile(key);
  }
};
