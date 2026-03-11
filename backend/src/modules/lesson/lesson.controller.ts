import { NextFunction, Request, Response } from "express";
import * as lessonService from './lesson.service';
import { ApiResponse } from "../../common/types/api";

export const createLesson = async (
  req: Request<{ classId: string }>,
  res: Response<ApiResponse<any>>,
  next: NextFunction,
) => {
  try {
    const files = req.files as Express.Multer.File[] || [];
    
    const lesson = await lessonService.createLesson(
      req.userId!,
      req.params.classId,
      req.body,
      files,
    );

    res.status(201).json({
      success: true,
      message: "Lesson created",
      data: lesson,
    });
  } catch (error) {
    next(error);
  }
};