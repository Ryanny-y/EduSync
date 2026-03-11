import { Router } from "express";
import * as lessonController from "./lesson.controller";
import { validate } from "../../common/middlewares/validate";
import verifyJwt from "../../common/middlewares/verifyJwt";
import { upload } from "../../common/middlewares/upload";
import { createLessonSchema, lessonParamsSchema } from "./lesson.schema";

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