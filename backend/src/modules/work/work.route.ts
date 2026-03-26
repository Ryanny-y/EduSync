import { Router } from "express";
import * as workController from "./work.controller";
import { validate } from "../../common/middlewares/validate";
import verifyJwt from "../../common/middlewares/verifyJwt";
import { createWorkSchema, updateWorkSchema, workParamsSchema } from "./work.schema";
import { upload } from "../../common/middlewares/upload";
import submissionRoutes from "../submission/submission.route";

const router = Router({ mergeParams: true });

// GET /classes/:classId/works - List all works of logged in student
router.get(
  "/my/all",
  verifyJwt,
  workController.getAllStudentWorks
);

router.get(
  "/my",
  verifyJwt,
  validate(workParamsSchema),
  workController.getStudentWorks
);

// GET /classes/:classId/works - List all works
router.get(
  "/",
  verifyJwt,
  validate(workParamsSchema),
  workController.getWorks
);

// GET /classes/:classId/works/:workId - Get single work
router.get(
  "/:workId",
  verifyJwt,
  validate(workParamsSchema),
  workController.getWork
);

// POST /classes/:classId/works - Create work
router.post(
  "/",
  verifyJwt,
  upload.array("materials", 10),
  validate(createWorkSchema),
  workController.createWork
);

// PATCH /classes/:classId/works/:workId - Update work
router.patch(
  "/:workId",
  verifyJwt,
  upload.array("materials", 10),
  validate(updateWorkSchema),
  workController.updateWork
);

// DELETE /classes/:classId/works/:workId - Delete work
router.delete(
  "/:workId",
  verifyJwt,
  validate(workParamsSchema),
  workController.deleteWork
);

// DELETE /classes/:classId/works/:workId/materials/:materialId - Delete specific material
// router.delete(
//   "/:workId/materials/:materialId",
//   verifyJwt,
//   workController.deleteMaterial
// );


// submission routes
router.use("/:workId/submissions", submissionRoutes);

export default router;