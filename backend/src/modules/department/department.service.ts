import prismaClient from "../../config/client";
import { CreateDepartmentDto, UpdateDepartmentDto, DepartmentDto } from "./department.types";
import { CustomError } from "../../common/utils/Errors";

export const createDepartment = async (
  data: CreateDepartmentDto
): Promise<DepartmentDto> => {

  const existing = await prismaClient.department.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new CustomError(409, "Department already exists");
  }

  const department = await prismaClient.department.create({
    data: {
      name: data.name,
    },
  });

  return department;
};

export const getDepartments = async (): Promise<DepartmentDto[]> => {
  return prismaClient.department.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getDepartmentById = async (id: string): Promise<DepartmentDto> => {

  const department = await prismaClient.department.findUnique({
    where: { id },
  });

  if (!department) {
    throw new CustomError(404, "Department not found");
  }

  return department;
};

export const updateDepartment = async (
  id: string,
  data: UpdateDepartmentDto
): Promise<DepartmentDto> => {

  const department = await prismaClient.department.findUnique({
    where: { id },
  });

  if (!department) {
    throw new CustomError(404, "Department not found");
  }

  const updated = await prismaClient.department.update({
    where: { id },
    data: {
      name: data.name,
    },
  });

  return updated;
};

export const deleteDepartment = async (id: string): Promise<void> => {

  const department = await prismaClient.department.findUnique({
    where: { id },
  });

  if (!department) {
    throw new CustomError(404, "Department not found");
  }

  await prismaClient.department.delete({
    where: { id },
  });
};