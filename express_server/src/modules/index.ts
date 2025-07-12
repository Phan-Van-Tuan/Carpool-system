import express from "express";
const router = express.Router();

import authRouter from "./auth/auth.router";
import accountRouter from "./account/account.router";
import adminRouter from "./admin/admin.router";
import riderRouter from "./rider/rider.router";
import driverRouter from "./driver/driver.router";
import otherRouter from "./other/other.router";

router.use("/auth/", authRouter);
router.use("/account/", accountRouter);
router.use("/admin/", adminRouter);
router.use("/rider/", riderRouter);
router.use("/driver/", driverRouter);
router.use("/", otherRouter);
router.get("/", (req, res) => {
  res.status(200).send("Hello from Express Server with Restful API!");
});

export default router;
