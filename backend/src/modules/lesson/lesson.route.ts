import { Router } from "express";
import * as lessonController from "./lesson.controller";
import { validate } from "../../common/middlewares/validate";
import { createLessonSchema } from "./lesson.types";
import verifyJwt from "../../common/middlewares/verifyJwt";
import { upload } from "../../common/middlewares/upload";

const router = Router({ mergeParams: true });


router.post(
  "/:classId",
  verifyJwt,
  upload.array("materials", 10),
  validate(createLessonSchema),
  lessonController.createLesson,
);

export default router;