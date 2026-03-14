import { Request, Response, NextFunction } from "express";
import * as submissionService from "./submission.service";
import { ApiResponse } from "../../common/types/api";
import {
  SubmissionDto,
  SubmissionListDto,
  SubmissionParams,
  GradeSubmissionInput,
  UpdateSubmissionFilesInput,
  GetSubmissionsResponse,
  GetSubmissionResponse,
  GetSubmissionsQuery,
} from "./submission.types";

// ==================== TEACHER CONTROLLERS ====================

export const getSubmissions = async (
  req: Request<SubmissionParams, {}, {}, { status?: string }>,
  res: Response<GetSubmissionsResponse>,
  next: NextFunction
) => {
  try {
    const result = await submissionService.getSubmissionsForWork(
      req.userId!,
      req.params.classId!,
      req.params.workId!,
      req.query.status
    );

    res.json({
      success: true,
      message: "Submissions retrieved",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const gradeSubmission = async (
  req: Request<SubmissionParams, {}, GradeSubmissionInput>,
  res: Response<GetSubmissionResponse>,
  next: NextFunction
) => {
  try {
    const result = await submissionService.gradeSubmission(
      req.userId!,
      req.params.classId!,
      req.params.workId!,
      req.params.submissionId!,
      req.body
    );

    res.json({
      success: true,
      message: "Submission graded",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== STUDENT CONTROLLERS ====================

export const getMySubmission = async (
  req: Request<SubmissionParams>,
  res: Response<GetSubmissionResponse>,
  next: NextFunction
) => {
  try {
    const result = await submissionService.getOrCreateMySubmission(
      req.userId!,
      req.params.classId!,
      req.params.workId!
    );

    res.json({
      success: true,
      message: "Submission retrieved",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const turnIn = async (
  req: Request<SubmissionParams>,
  res: Response<GetSubmissionResponse>,
  next: NextFunction
) => {
  try {
    const result = await submissionService.turnInSubmission(
      req.userId!,
      req.params.submissionId!
    );

    res.json({
      success: true,
      message: "Work turned in",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// export const unsubmit = async (
//   req: Request<SubmissionParams>,
//   res: Response<GetSubmissionResponse>,
//   next: NextFunction
// ) => {
//   try {
//     const result = await submissionService.unsubmitSubmission(
//       req.userId!,
//       req.params.submissionId!
//     );

//     res.json({
//       success: true,
//       message: "Work unsubmitted",
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const addFiles = async (
  req: Request<SubmissionParams>,
  res: Response<GetSubmissionResponse>,
  next: NextFunction
) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    
    const result = await submissionService.addSubmissionFiles(
      req.userId!,
      req.params.submissionId!,
      files
    );

    res.json({
      success: true,
      message: "Files added",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFiles = async (
  req: Request<SubmissionParams, {}, UpdateSubmissionFilesInput>,
  res: Response<GetSubmissionResponse>,
  next: NextFunction
) => {
  try {
    const result = await submissionService.deleteSubmissionFiles(
      req.userId!,
      req.params.submissionId!,
      req.body.filesToDelete || []
    );

    res.json({
      success: true,
      message: "File deleted",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// export const deleteSub = async (
//   req: Request<SubmissionParams>,
//   res: Response<ApiResponse<void>>,
//   next: NextFunction
// ) => {
//   try {
//     await submissionService.deleteSubmission(
//       req.userId!,
//       req.role!,
//       req.params.submissionId!
//     );

//     res.json({
//       success: true,
//       message: "Submission deleted",
//       data: undefined,
//     });
//   } catch (error) {
//     next(error);
//   }
// };