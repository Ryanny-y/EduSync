import { Request, Response, NextFunction } from "express";
import * as classService from "./class.service";
import {
  CreateClassDto,
  CreateClassResponse,
  GetClassesResponse,
  GetClassResponse,
  UpdateClassDto,
  UpdateClassResponse,
  DeleteClassResponse,
  ClassDto,
  JoinClassDto,
} from "./class.types";
import { ApiResponse } from "../../common/types/api";
import { mapClassToDto } from "./class.mapper";

export const createClass = async (
  req: Request<{}, {}, CreateClassDto>,
  res: Response<CreateClassResponse>,
  next: NextFunction,
) => {
  try {
    const teacherId = req.userId!;

    const created = await classService.createClass(
      teacherId,
      req.role,
      req.body,
    );

    return res.status(201).json({
      success: true,
      message: "Class created",
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

export const getClasses = async (
  req: Request,
  res: Response<GetClassesResponse>,
  next: NextFunction,
) => {
  try {
    const classes = await classService.getClasses(req.userId!, req.role!);

    return res.json({
      success: true,
      message: "Classes fetched",
      data: classes,
    });
  } catch (error) {
    next(error);
  }
};

export const getClassById = async (
  req: Request<{ id: string }>,
  res: Response<GetClassResponse>,
  next: NextFunction,
) => {
  try {
    if (!req.userId) {
      throw new Error("Unauthorized");
    }

    const cls = await classService.getClassById(
      req.userId,
      req.role,
      req.params.id,
    );

    return res.json({
      success: true,
      message: "Class fetched",
      data: cls,
    });
  } catch (error) {
    next(error);
  }
};

export const updateClass = async (
  req: Request<{ id: string }, {}, UpdateClassDto>,
  res: Response<UpdateClassResponse>,
  next: NextFunction,
) => {
  try {
    const teacherId = req.userId!;

    const updated = await classService.updateClass(
      teacherId,
      req.params.id,
      req.body,
    );

    return res.json({
      success: true,
      message: "Class updated",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteClass = async (
  req: Request<{ id: string }>,
  res: Response<DeleteClassResponse>,
  next: NextFunction,
) => {
  try {
    const teacherId = req.userId!;

    await classService.deleteClass(teacherId, req.params.id);

    return res.json({
      success: true,
      message: "Class deleted successfully.",
      data: undefined,
    });
  } catch (error) {
    next(error);
  }
};


// Other Controller
export const joinClass = async (
  req: Request<{}, {}, JoinClassDto>,
  res: Response<ApiResponse<ClassDto>>,
  next: NextFunction,
) => {
  try {
    const userId = req.userId!;
    const { code } = req.body;

    const joinedClass = await classService.joinClassService(userId, code);

    return res.status(200).json({
      success: true,
      message: "Successfully joined class",
      data: joinedClass,
    });
  } catch (error) {
    next(error);
  }
};