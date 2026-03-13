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
import lessonRoute from '../lesson/lesson.route';
import workRoute from '../work/work.route';

const router = Router();

// CRUD
router.post(
  "/",
  verifyJwt,
  validate(createClassBodySchema),
  classController.createClass,
);

router.get("/", verifyJwt, classController.getClasses);

router.get(
  "/:id",
  verifyJwt,
  validate(classParamsSchema),
  classController.getClassById,
);

router.put(
  "/:id",
  verifyJwt,
  validate(updateClassBodySchema),
  classController.updateClass,
);

router.delete(
  "/:id",
  verifyJwt,
  validate(classParamsSchema),
  classController.deleteClass,
);

// ----------- OTHER ENDPOINTS --------------------------
router.post(
  "/join",
  verifyJwt,
  validate(joinClassBodySchema),
  classController.joinClass,
);

router.post(
  "/:id/unenroll",
  verifyJwt,
  validate(unenrollClassParamsSchema),
  classController.unenrollClass,
);

// Nested Routes
router.use("/:classId/lessons", lessonRoute)
router.use("/:classId/works", workRoute);

router.get(
  "/:id/stream",
  verifyJwt,
  validate(classParamsSchema),
  classController.getClassStream,
);

router.get(
  "/:id/students",
  verifyJwt,
  validate(classParamsSchema),
  classController.getClassStudents,
);

export default router;
