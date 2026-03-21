import { Request, Response, Router } from "express";
import authRoute from "./auth/auth.route";
import departmentRoute from "./department/department.route";
import classRoute from "./class/class.route";
import workRoute from './work/work.route';
import chatRoute from './chat/chat.route';

const router = Router();

// AUTH
router.use("/auth", authRoute);

// PUBLIC
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});


router.use("/department", departmentRoute);
// router.use("/booking", bookingRoute);

// PROTECTED
router.use("/class", classRoute);
router.use("/works", workRoute);

router.use("/chat", chatRoute);


export default router;