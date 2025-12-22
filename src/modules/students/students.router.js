import { Router } from "express";
import * as studentsControllar from "./students.controllar.js";
import { auth, allowRoles } from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/start-enroll",
  auth,
  allowRoles("admin"),
  studentsControllar.startEnroll
);

router.get("/command", studentsControllar.getCommand);

router.post("/enroll-result", studentsControllar.enrollResult);

router.get(
  "/enroll-result",
  auth,
  allowRoles("admin"),
  studentsControllar.getEnrollResult
);

router.post(
  "/enroll-fingerprint",
  auth,
  allowRoles("admin"),
  studentsControllar.saveFingerprint
);

export default router;
