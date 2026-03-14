import {
  SubmissionDto,
  SubmissionListDto,
  SubmissionStatus,
} from "./submission.types";

export function mapToSubmissionDto(
  submission: any,
  dueDate: Date | null,
): SubmissionDto {
  const isLate =
    submission.turnedInAt && dueDate && submission.turnedInAt > dueDate;

  let status: SubmissionStatus = "PENDING";
  if (submission.gradedAt) {
    status = "GRADED";
  } else if (submission.turnedInAt && isLate) {
    status = "LATE";
  } else if (submission.turnedInAt) {
    status = "SUBMITTED";
  } else if (dueDate && new Date() > dueDate) {
    status = "MISSING";
  }

  return {
    id: submission.id,
    studentId: submission.studentId,
    studentName: `${submission.student.firstName} ${submission.student.lastName}`,
    workId: submission.workId,
    workTitle: submission.work?.title || "",
    status,
    turnedInAt: submission.turnedInAt,
    gradedAt: submission.gradedAt,
    grade: submission.grade,
    feedback: submission.feedBack,
    files:
      submission.files?.map((f: any) => ({
        id: f.id,
        file: {
          id: f.file.id,
          fileName: f.file.fileName,
          fileType: f.file.fileType,
          path: f.file.path,
          size: f.file.size,
          bucket: f.file.bucket,
          url: f.file.url,
          urlExpiresAt: f.file.urlExpiresAt,
          createdAt: f.file.createdAt,
        },
      })) || [],
    isLate: !!isLate,
    createdAt: submission.createdAt,
  };
}

export function mapToSubmissionListDto(
  submissions: any[],
  totalStudents: number,
  dueDate: Date | null,
): SubmissionListDto {
  const mappedSubmissions = submissions.map((s) =>
    mapToSubmissionDto(s, dueDate),
  );

  return {
    submissions: mappedSubmissions,
    stats: {
      total: totalStudents,
      pending: mappedSubmissions.filter((s) => s.status === "PENDING").length,
      submitted: mappedSubmissions.filter((s) => s.status === "SUBMITTED")
        .length,
      graded: mappedSubmissions.filter((s) => s.status === "GRADED").length,
      late: mappedSubmissions.filter((s) => s.status === "LATE").length,
      missing: mappedSubmissions.filter((s) => s.status === "MISSING").length,
    },
  };
}
