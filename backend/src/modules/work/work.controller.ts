import { NextFunction, Request, Response } from "express";
import * as workService from './work.service';
import { GetStudentWorksResponse, GetWorkResponse, GetWorksResponse, WorkDto, WorkParams } from "./work.types";
import { ApiResponse } from "../../common/types/api";


export const getStudentWorks = async (
  req: Request<WorkParams>,
  res: Response<GetStudentWorksResponse>,
  next: NextFunction
) => {
  try {
    const works = await workService.getStudentWorks(
      req.userId!,
      req.role,
      req.params.classId!
    );

    res.json({
      success: true,
      message: "Works retrieved",
      data: works,
    });
  } catch (error) {
    next(error);
  }
};

// ============================= TEACHER ============================
export const getWorks = async (
  req: Request<WorkParams>,
  res: Response<GetWorksResponse>,
  next: NextFunction
) => {
  try {
    const works = await workService.getWorksByClassId(
      req.userId!,
      req.role!,
      req.params.classId!
    );

    res.json({
      success: true,
      message: "Works retrieved",
      data: works,
    });
  } catch (error) {
    next(error);
  }
};

export const getWork = async (
  req: Request<WorkParams>,
  res: Response<GetWorkResponse>,
  next: NextFunction
) => {
  try {
    const work = await workService.getWorkById(
      req.userId!,
      req.role!,
      req.params.classId!,
      req.params.workId!
    );

    res.json({
      success: true,
      message: "Work retrieved",
      data: work,
    });
  } catch (error) {
    next(error);
  }
};

export const createWork = async (
  req: Request<WorkParams>,
  res: Response<ApiResponse<WorkDto>>,
  next: NextFunction
) => {
  try {
    const files = req.files as Express.Multer.File[] || [];

    const work = await workService.createWork(
      req.userId!,
      req.params.classId!,
      req.body,
      files
    );

    res.status(201).json({
      success: true,
      message: "Work created",
      data: work,
    });
  } catch (error) {
    next(error);
  }
};

// export const updateWork = async (
//   req: Request<WorkParams>,
//   res: Response<ApiResponse<WorkDto>>,
//   next: NextFunction
// ) => {
//   try {
//     const files = (req.files as Express.Multer.File[]) || [];

//     const work = await workService.updateWork(
//       req.userId!,
//       req.params.classId,
//       req.params.workId!,
//       req.body,
//       files
//     );

//     res.json({
//       success: true,
//       message: "Work updated",
//       data: work,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const deleteWork = async (
  req: Request<WorkParams>,
  res: Response<ApiResponse<void>>,
  next: NextFunction
) => {
  try {
    await workService.deleteWork(
      req.userId!,
      req.params.classId!,
      req.params.workId!
    );

    res.json({
      success: true,
      message: "Work deleted",
      data: undefined,
    });
  } catch (error) {
    next(error);
  }
};

// export const deleteMaterial = async (
//   req: Request<WorkParams & { materialId: string }>,
//   res: Response<ApiResponse<void>>,
//   next: NextFunction
// ) => {
//   try {
//     await workService.deleteWorkMaterial(
//       req.userId!,
//       req.params.classId,
//       req.params.workId!,
//       req.params.materialId
//     );

//     res.json({
//       success: true,
//       message: "Material deleted",
//       data: undefined,
//     });
//   } catch (error) {
//     next(error);
//   }
// };