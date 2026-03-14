import prismaClient from "../../config/client";
import { CustomError } from "../../common/utils/Errors";
import * as s3Service from "../../infra/storage/s3.service";
import {
  mapToSubmissionDto,
  mapToSubmissionListDto,
} from "./submission.mapper";
import {
  SubmissionDto,
  SubmissionListDto,
  GradeSubmissionInput,
} from "./submission.types";
import { verifyClassAccess } from "../class/class.helpers";
import { mapMimeTypeToFileType } from "../../common/utils/file-utils";

// ==================== STUDENT SERVICES ====================
export const getSubmissionsForWork = async (
  teacherId: string,
  classId: string,
  workId: string,
  filterStatus: string = "ALL",
): Promise<SubmissionListDto> => {
  await verifyClassAccess(teacherId, "TEACHER", classId, true);

  const work = await prismaClient.work.findFirst({
    where: { id: workId, classId, class: { teacherId } },
    select: {
      dueDate: true,
      submissions: {
        orderBy: { createdAt: "desc" },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          files: {
            select: {
              file: {
                select: {
                  id: true,
                  fileName: true,
                  fileType: true,
                  path: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!work) {
    throw new CustomError(404, "Work not found or access denied");
  }

  const studentCount = await prismaClient.user.count({
    where: {
      joinedClasses: {
        some: { id: classId },
      },
    },
  });

  const submissions = await Promise.all(
    work.submissions.map(async (sub) => ({
      ...sub,
      files: await Promise.all(
        sub.files.map(async (f) => ({
          ...f,
          file: {
            ...f.file,
            url: await s3Service.generatePresignedUrl(f.file.path),
          },
        })),
      ),
    })),
  );

  let filtered = submissions;

  if (filterStatus !== "ALL") {
    filtered = submissions.filter((sub) => {
      const dto = mapToSubmissionDto(sub, work.dueDate);
      return dto.status === filterStatus;
    });
  }

  return mapToSubmissionListDto(filtered, studentCount, work.dueDate);
};

export const gradeSubmission = async (
  teacherId: string,
  classId: string,
  workId: string,
  submissionId: string,
  input: GradeSubmissionInput,
): Promise<SubmissionDto> => {
  await verifyClassAccess(teacherId, "TEACHER", classId, true);

  const work = await prismaClient.work.findFirst({
    where: { id: workId, classId, class: { teacherId } },
  });

  if (!work) {
    throw new CustomError(404, "Work not found or access denied");
  }

  const submission = await prismaClient.submission.findFirst({
    where: { id: submissionId, workId },
    include: {
      student: { select: { id: true, firstName: true, lastName: true } },
      files: { include: { file: true } },
    },
  });

  if (!submission) {
    throw new CustomError(404, "Submission not found");
  }

  if (!submission.turnedInAt) {
    throw new CustomError(400, "Cannot grade unsubmitted work");
  }

  const updated = await prismaClient.submission.update({
    where: { id: submissionId },
    data: {
      grade: input.grade,
      feedBack: input.feedback || null,
      gradedAt: new Date(),
    },
    include: {
      student: { select: { id: true, firstName: true, lastName: true } },
      files: { include: { file: true } },
    },
  });

  return mapToSubmissionDto(updated, work.dueDate);
};

// ==================== STUDENT SERVICES ====================
export const getOrCreateMySubmission = async (
  studentId: string,
  classId: string,
  workId: string
): Promise<SubmissionDto> => {
  
  // Verify enrollment
  const enrolled = await prismaClient.class.findFirst({
    where: {
      id: classId,
      students: { some: { id: studentId } },
      works: { some: { id: workId } },
    },
    select: { id: true },
  });

  if (!enrolled) {
    throw new CustomError(404, "Work not found or not enrolled");
  }

  // Upsert submission
  const submission = await prismaClient.submission.upsert({
    where: {
      studentId_workId: {
        studentId,
        workId,
      },
    },
    create: {
      studentId,
      workId,
    },
    update: {},
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      files: {
        include: { file: true },
      },
      work: {
        select: { dueDate: true },
      },
    },
  });

  // Generate presigned URLs dynamically
  const filesWithUrls = await Promise.all(
    submission.files.map(async (f) => ({
      ...f,
      file: {
        ...f.file,
        url: await s3Service.generatePresignedUrl(f.file.path),
      },
    }))
  );

  const submissionWithUrls = {
    ...submission,
    files: filesWithUrls,
  };

  return mapToSubmissionDto(submissionWithUrls, submission.work.dueDate);
};

// export const turnInSubmission = async (
//   studentId: string,
//   submissionId: string
// ): Promise<SubmissionDto> => {
//   const submission = await prismaClient.submission.findFirst({
//     where: { id: submissionId, studentId },
//     include: {
//       work: true,
//       student: { select: { id: true, firstName: true, lastName: true } },
//       files: { include: { file: true } },
//     },
//   });

//   if (!submission) {
//     throw new CustomError(404, "Submission not found");
//   }

//   if (submission.turnedInAt) {
//     throw new CustomError(400, "Already turned in");
//   }

//   if (submission.files.length === 0) {
//     throw new CustomError(400, "Cannot submit without files");
//   }

//   const updated = await prismaClient.submission.update({
//     where: { id: submissionId },
//     data: { turnedInAt: new Date() },
//     include: {
//       student: { select: { id: true, firstName: true, lastName: true } },
//       files: { include: { file: true } },
//     },
//   });

//   return mapToSubmissionDto(updated, submission.work.dueDate);
// };

// export const unsubmitSubmission = async (
//   studentId: string,
//   submissionId: string
// ): Promise<SubmissionDto> => {
//   const submission = await prismaClient.submission.findFirst({
//     where: { id: submissionId, studentId },
//     include: {
//       work: true,
//       student: { select: { id: true, firstName: true, lastName: true } },
//       files: { include: { file: true } },
//     },
//   });

//   if (!submission) {
//     throw new CustomError(404, "Submission not found");
//   }

//   if (!submission.turnedInAt) {
//     throw new CustomError(400, "Not yet turned in");
//   }

//   if (submission.gradedAt) {
//     throw new CustomError(403, "Cannot unsubmit graded work");
//   }

//   const updated = await prismaClient.submission.update({
//     where: { id: submissionId },
//     data: { turnedInAt: null },
//     include: {
//       student: { select: { id: true, firstName: true, lastName: true } },
//       files: { include: { file: true } },
//     },
//   });

//   return mapToSubmissionDto(updated, submission.work.dueDate);
// };

export const addSubmissionFiles = async (
  studentId: string,
  submissionId: string,
  files: Express.Multer.File[]
): Promise<SubmissionDto> => {
  const submission = await prismaClient.submission.findFirst({
    where: { id: submissionId, studentId },
    include: { work: true },
  });

  if (!submission) {
    throw new CustomError(404, "Submission not found");
  }

  if (submission.turnedInAt) {
    throw new CustomError(403, "Cannot modify turned in submission");
  }

  const updated = await prismaClient.$transaction(async (tx) => {
    for (const file of files) {
      const s3Result = await s3Service.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        `submissions/${submissionId}`
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

      await tx.submissionFile.create({
        data: {
          submissionId,
          fileId: fileRecord.id,
        },
      });
    }

    return tx.submission.findUnique({
      where: { id: submissionId },
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
        files: { include: { file: true } },
      },
    });
  });

  return mapToSubmissionDto(updated!, submission.work.dueDate);
};

// export const deleteSubmissionFiles = async (
//   studentId: string,
//   submissionId: string,
//   fileIds: string[]
// ): Promise<SubmissionDto> => {
//   const submission = await prismaClient.submission.findFirst({
//     where: { id: submissionId, studentId },
//     include: {
//       work: true,
//       files: { include: { file: true } },
//     },
//   });

//   if (!submission) {
//     throw new CustomError(404, "Submission not found");
//   }

//   if (submission.turnedInAt) {
//     throw new CustomError(403, "Cannot modify turned in submission");
//   }

//   const validFileIds = submission.files
//     .filter((f) => fileIds.includes(f.fileId))
//     .map((f) => f.fileId);

//   if (validFileIds.length !== fileIds.length) {
//     throw new CustomError(400, "Some files do not belong to this submission");
//   }

//   const updated = await prismaClient.$transaction(async (tx) => {
//     for (const fileId of validFileIds) {
//       const file = await tx.file.findUnique({ where: { id: fileId } });
//       if (file) {
//         await s3Service.deleteFile(file.path);
//         await tx.submissionFile.deleteMany({
//           where: { submissionId, fileId },
//         });
//         await tx.file.delete({ where: { id: fileId } });
//       }
//     }

//     return tx.submission.findUnique({
//       where: { id: submissionId },
//       include: {
//         student: { select: { id: true, firstName: true, lastName: true } },
//         files: { include: { file: true } },
//       },
//     });
//   });

//   return mapToSubmissionDto(updated!, submission.work.dueDate);
// };

// export const deleteSubmission = async (
//   userId: string,
//   role: string,
//   submissionId: string
// ): Promise<void> => {
//   const submission = await prismaClient.submission.findUnique({
//     where: { id: submissionId },
//     include: {
//       work: { include: { class: true } },
//       files: { include: { file: true } },
//     },
//   });

//   if (!submission) {
//     throw new CustomError(404, "Submission not found");
//   }

//   const isTeacher = role === "TEACHER" && submission.work.class.teacherId === userId;
//   const isAdmin = role === "ADMIN";
//   const isOwner = submission.studentId === userId && !submission.turnedInAt;

//   if (!isTeacher && !isAdmin && !isOwner) {
//     throw new CustomError(403, "Access denied");
//   }

//   await prismaClient.$transaction(async (tx) => {
//     for (const fileLink of submission.files) {
//       await s3Service.deleteFile(fileLink.file.path);
//       await tx.file.delete({ where: { id: fileLink.fileId } });
//     }

//     await tx.submission.delete({ where: { id: submissionId } });
//   });
// };
