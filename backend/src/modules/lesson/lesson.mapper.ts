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

export const mapMimeTypeToFileType = (mimeType: string): FileType => {
  if (mimeType.includes("pdf")) return FileType.PDF;
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint"))
    return FileType.PPT;
  if (mimeType.includes("word") || mimeType.includes("document"))
    return FileType.DOC;
  if (mimeType.includes("video")) return FileType.VIDEO;
  return FileType.PDF; // default
};
