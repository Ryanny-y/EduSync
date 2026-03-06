import { Router } from "express";
import authRoute from "./auth/auth.route";

const router = Router();

// AUTH
router.use("/auth", authRoute);

// PUBLIC
// router.use("/health", healthRoute);
// router.use("/booking", bookingRoute);

// PROTECTED
// router.use("/resort", resortRoute);
// router.use("/pricing-rules", pricingRoute);
// router.use("/holidays", holidayRoute);
// router.use("/peak-seasons", peakSeasonRoute);

export default router;