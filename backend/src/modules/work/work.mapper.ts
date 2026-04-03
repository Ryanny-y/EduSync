import { WorkDto } from "./work.types";

export function mapToWorkDto(work: any): WorkDto {
  const submissions = work.submissions || [];

  return {
    id: work.id,
    title: work.title,
    description: work.description,
    type: work.type,
    dueDate: work.dueDate,
    classId: work.classId,
    workLinks: work.workLinks || [],
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
    submissionStats: {
      total: work._count?.submissions || 0,
      submitted: submissions.filter((s: any) => s.turnedInAt !== null).length,
      graded: submissions.filter((s: any) => s.gradedAt !== null).length,
      missing: submissions.filter((s: any) => s.turnedInAt === null && work.dueDate && new Date() > work.dueDate).length,
    },
  };
}
