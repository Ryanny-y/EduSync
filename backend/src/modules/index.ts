import { Router } from "express";
import authRoute from "./auth/auth.route";
import departmentRoute from "./department/department.route";
import classRoute from "./class/class.route";
import lessonRoute from "./lesson/lesson.route";

const router = Router();

// AUTH
router.use("/auth", authRoute);

// PUBLIC
router.use("/department", departmentRoute);
// router.use("/booking", bookingRoute);

// PROTECTED
router.use("/class", classRoute);
router.use("/lessons", lessonRoute);
// router.use("/holidays", holidayRoute);
// router.use("/peak-seasons", peakSeasonRoute);

export default router;