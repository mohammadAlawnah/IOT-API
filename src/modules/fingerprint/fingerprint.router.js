import { Router } from "express";
import { enrollViaDevice } from "./fingerprint.controller.js";
import { auth, allowRoles } from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/enroll",
  auth,
  allowRoles("admin"),
  enrollViaDevice
);

export default router;
