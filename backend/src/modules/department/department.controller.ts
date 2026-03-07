import { Request, Response, NextFunction } from "express";
import * as departmentService from "./department.service";
import {
  CreateDepartmentDto,
  CreateDepartmentResponse,
  GetDepartmentsResponse,
  GetDepartmentResponse,
  UpdateDepartmentDto,
  UpdateDepartmentResponse,
  DeleteDepartmentResponse,
} from "./department.types";

export const createDepartment = async (
  req: Request<{}, {}, CreateDepartmentDto>,
  res: Response<CreateDepartmentResponse>,
  next: NextFunction
) => {
  try {

    const department = await departmentService.createDepartment(req.body);

    return res.status(201).json({
      success: true,
      message: "Department created",
      data: department,
    });

  } catch (error) {
    next(error);
  }
};

export const getDepartments = async (
  req: Request,
  res: Response<GetDepartmentsResponse>,
  next: NextFunction
) => {
  try {

    const departments = await departmentService.getDepartments();

    return res.json({
      success: true,
      message: "Departments fetched",
      data: departments,
    });

  } catch (error) {
    next(error);
  }
};

export const getDepartmentById = async (
  req: Request<{ id: string }>,
  res: Response<GetDepartmentResponse>,
  next: NextFunction
) => {
  try {

    const department = await departmentService.getDepartmentById(req.params.id);

    return res.json({
      success: true,
      message: "Department fetched",
      data: department,
    });

  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (
  req: Request<{ id: string }, {}, UpdateDepartmentDto>,
  res: Response<UpdateDepartmentResponse>,
  next: NextFunction
) => {
  try {

    const department = await departmentService.updateDepartment(
      req.params.id,
      req.body
    );

    return res.json({
      success: true,
      message: "Department updated",
      data: department,
    });

  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (
  req: Request<{ id: string }>,
  res: Response<DeleteDepartmentResponse>,
  next: NextFunction
) => {
  try {

    await departmentService.deleteDepartment(req.params.id);

    return res.json({
      success: true,
      message: "Department deleted",
      data: undefined,
    });

  } catch (error) {
    next(error);
  }
};