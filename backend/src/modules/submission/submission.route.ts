import { Router } from "express";
import * as submissionController from "./submission.controller";
import { validate } from "../../common/middlewares/validate";
import {
  getSubmissionsQuerySchema,
  gradeSubmissionSchema,
  updateSubmissionFilesSchema,
  submissionParamsSchema,
  singleSubmissionParamsSchema,
} from "./submission.schema";
import verifyJwt from "../../common/middlewares/verifyJwt";
import multer from "multer";

const router = Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage() });

// ==================== TEACHER ROUTES ====================

// GET /classes/:classId/works/:workId/submissions?status=ALL|PENDING|SUBMITTED|GRADED|LATE|MISSING
router.get(
  "/",
  verifyJwt,
  validate(getSubmissionsQuerySchema),
  submissionController.getSubmissions
);

// POST /classes/:classId/works/:workId/submissions/:submissionId/grade
router.post(
  "/:submissionId/grade",
  verifyJwt,
  validate(gradeSubmissionSchema),
  submissionController.gradeSubmission
);

// ==================== STUDENT ROUTES ====================

// // GET /classes/:classId/works/:workId/submissions/my
router.get(
  "/my",
  verifyJwt,
  submissionController.getMySubmission
);

// // POST /classes/:classId/works/:workId/submissions/:submissionId/turn-in
// router.post(
//   "/:submissionId/turn-in",
//   verifyJwt,
//   validate(singleSubmissionParamsSchema),
//   submissionController.turnIn
// );

// // POST /classes/:classId/works/:workId/submissions/:submissionId/unsubmit
// router.post(
//   "/:submissionId/unsubmit",
//   verifyJwt,
//   validate(singleSubmissionParamsSchema),
//   submissionController.unsubmit
// );

// POST /classes/:classId/works/:workId/submissions/:submissionId/files
router.post(
  "/:submissionId/files",
  verifyJwt,
  upload.array("files", 10),
  submissionController.addFiles
);

// DELETE /classes/:classId/works/:workId/submissions/:submissionId/files
router.delete(
  "/:submissionId/files",
  verifyJwt,
  validate(updateSubmissionFilesSchema),
  submissionController.deleteFiles
);

// // DELETE /classes/:classId/works/:workId/submissions/:submissionId
// router.delete(
//   "/:submissionId",
//   verifyJwt,
//   validate(singleSubmissionParamsSchema),
//   submissionController.deleteSub
// );

export default router;