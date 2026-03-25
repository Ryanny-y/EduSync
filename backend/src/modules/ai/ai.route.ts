import { Router } from "express";
import { generateReviewer } from "./ai.controller";
import { upload } from "../../common/middlewares/upload";
import verifyJwt from "../../common/middlewares/verifyJwt";

const router = Router();

router.post("/reviewer", upload.array("files", 5), generateReviewer);

export default router;