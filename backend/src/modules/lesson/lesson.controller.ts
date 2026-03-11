import { NextFunction, Request, Response } from "express";
import * as lessonService from './lesson.service';
import { ApiResponse } from "../../common/types/api";

export const getLessons = async (
  req: Request<{ classId: string }>,
  res: Response<ApiResponse<any>>,
  next: NextFunction,
) => {
  try {
    const lessons = await lessonService.getLessonsByClassId(
      req.userId!,
      req.role!,
      req.params.classId,
    );

    res.json({
      success: true,
      message: "Lessons fetched",
      data: lessons,
    });
  } catch (error) {
    next(error);
  }
};

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

export const deleteLesson = async (
  req: Request<{ classId: string; lessonId: string }>,
  res: Response<ApiResponse<void>>,
  next: NextFunction,
) => {
  try {
    await lessonService.deleteLesson(req.userId!, req.params.lessonId);

    res.json({
      success: true,
      message: "Lesson deleted",
      data: undefined,
    });
  } catch (error) {
    next(error);
  }
};