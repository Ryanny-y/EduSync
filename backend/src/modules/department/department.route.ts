import { Router } from "express";
import * as departmentController from "./department.controller";
import { validate } from "../../common/middlewares/validate";
import {
  createDepartmentBodySchema,
  updateDepartmentBodySchema,
  departmentParamsSchema,
} from "./department.schema";

const router = Router();

router.post(
  "/",
  validate(createDepartmentBodySchema),
  departmentController.createDepartment
);

router.get(
  "/",
  departmentController.getDepartments
);

router.get(
  "/:id",
  validate(departmentParamsSchema),
  departmentController.getDepartmentById
);

router.put(
  "/:id",
  validate(updateDepartmentBodySchema),
  departmentController.updateDepartment
);

router.delete(
  "/:id",
  validate(departmentParamsSchema),
  departmentController.deleteDepartment
);

export default router;