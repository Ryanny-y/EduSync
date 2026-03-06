  import { Router } from "express";
import { createUser, login } from "./auth.controller";
import { validate } from "../../common/middlewares/validate";
import {
  createUserBodySchema,
  loginUserBodySchema,
  // loginUserBodySchema,
  // refreshTokenCookieSchema,
} from "./auth.schema";

const router = Router();

router.post("/signup", validate(createUserBodySchema), createUser);
router.post("/login", validate(loginUserBodySchema), login);
// router.post("/refresh-token", refreshToken);
// router.post("/logout", logout)

export default router;