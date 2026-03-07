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
} from "./class.types";

export const createClass = async (
  req: Request<{}, {}, CreateClassDto>,
  res: Response<CreateClassResponse>,
  next: NextFunction
) => {
  try {

    const teacherId = req.userId!;

    const created = await classService.createClass(
      teacherId,
      req.body
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
  next: NextFunction
) => {
  try {
    const classes = await classService.getClasses(req.userId!);

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
  next: NextFunction
) => {
  try {

    const cls = await classService.getClassById(req.params.id);

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
  next: NextFunction
) => {
  try {

    const teacherId = req.userId!;

    const updated = await classService.updateClass(
      teacherId,
      req.params.id,
      req.body
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
  next: NextFunction
) => {
  try {

    const teacherId = req.userId!;

    await classService.deleteClass(
      teacherId,
      req.params.id
    );

    return res.json({
      success: true,
      message: "Class deleted",
      data: undefined,
    });

  } catch (error) {
    next(error);
  }
};