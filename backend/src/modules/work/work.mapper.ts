import { WorkDto } from "./work.types";

export function mapToWorkDto(work: any): WorkDto {
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
        file: {
          fileName: m.file.fileName,
          fileType: m.file.fileType,
          s3Key: m.file.path,
          url: m.file.url,
          size: m.file.size,
        },
      })) || [],
    submissionCount: work._count?.submissions || 0,
  };
}
