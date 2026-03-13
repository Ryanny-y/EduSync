import { FileType } from "../../generated/prisma";
import { LessonDto } from "./lesson.types";

export const mapLessonToDto = (lesson: any): LessonDto => ({
  id: lesson.id,
  title: lesson.title,
  classId: lesson.classId,
  createdAt: lesson.createdAt,

  materials:
    lesson.materials?.map((m: any) => ({
      id: m.id,
      fileName: m.file.fileName,
      fileType: m.file.fileType,
      s3Key: m.file.path,
      url: m.file.url, // Presigned URL
      size: m.file.size,
    })) || [],
});