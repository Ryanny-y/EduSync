  import { Router } from "express";
import { createUser, login, logout, refreshToken } from "./auth.controller";
import { validate } from "../../common/middlewares/validate";
import {
  createUserBodySchema,
  loginUserBodySchema,
  refreshTokenCookieSchema,
} from "./auth.schema";

const router = Router();

router.post("/signup", validate(createUserBodySchema), createUser);
router.post("/login", validate(loginUserBodySchema), login);
router.post("/refresh-token", validate(refreshTokenCookieSchema), refreshToken);
router.post("/logout", logout)

export default router;