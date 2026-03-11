import { Router } from "express";
import * as lessonController from "./lesson.controller";
import { validate } from "../../common/middlewares/validate";
import { createLessonSchema, lessonParamsSchema } from "./lesson.types";
import verifyJwt from "../../common/middlewares/verifyJwt";
import { upload } from "../../common/middlewares/upload";

const router = Router({ mergeParams: true });

router.post(
  "/",
  verifyJwt,
  upload.array("materials", 10),
  validate(createLessonSchema),
  lessonController.createLesson,
);

router.get(
  "/",
  verifyJwt,
  validate(lessonParamsSchema),
  lessonController.getLessons,
);

router.delete(
  "/:lessonId",
  verifyJwt,
  validate(lessonParamsSchema),
  lessonController.deleteLesson,
);

export default router;