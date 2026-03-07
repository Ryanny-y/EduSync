import { Router } from "express";
import authRoute from "./auth/auth.route";
import departmentRoute from "./department/department.route";

const router = Router();

// AUTH
router.use("/auth", authRoute);

// PUBLIC
router.use("/department", departmentRoute);
// router.use("/booking", bookingRoute);

// PROTECTED
// router.use("/resort", resortRoute);
// router.use("/pricing-rules", pricingRoute);
// router.use("/holidays", holidayRoute);
// router.use("/peak-seasons", peakSeasonRoute);

export default router;