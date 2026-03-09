import { Router } from "express";
import * as classController from "./class.controller";
import { validate } from "../../common/middlewares/validate";
import {
  createClassBodySchema,
  updateClassBodySchema,
  classParamsSchema,
  joinClassBodySchema,
  unenrollClassParamsSchema,
} from "./class.schema";
import verifyJwt from "../../common/middlewares/verifyJwt";

const router = Router();

router.post(
  "/",
  verifyJwt,
  validate(createClassBodySchema),
  classController.createClass
);

router.get(
  "/",
  verifyJwt,
  classController.getClasses
);

router.get(
  "/:id",
  verifyJwt,
  validate(classParamsSchema),
  classController.getClassById
);

router.put(
  "/:id",
  verifyJwt,
  validate(updateClassBodySchema),
  classController.updateClass
);

router.delete(
  "/:id",
  verifyJwt,
  validate(classParamsSchema),
  classController.deleteClass
);

router.post(
  "/join",
  verifyJwt,
  validate(joinClassBodySchema),
  classController.joinClass
);

router.post(
  "/:id/unenroll",
  verifyJwt,
  validate(unenrollClassParamsSchema),
  classController.unenrollClass
);

export default router;