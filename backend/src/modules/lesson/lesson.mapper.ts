import { LessonDto } from "./lesson.types";

export const mapLessonToDto = (lesson: any): LessonDto => ({
  id: lesson.id,
  title: lesson.title,
  classId: lesson.classId,
  createdAt: lesson.createdAt,
  updatedAt: lesson.updatedAt,

  materials:
    lesson.materials?.map((m: any) => ({
      id: m.id,
      file: {
        fileName: m.file.fileName,
        fileType: m.file.fileType,
        s3Key: m.file.path,
        url: m.file.url,
        size: m.file.size,
      }
    })) || [],
});