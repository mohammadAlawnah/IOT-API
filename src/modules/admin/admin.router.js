import { Router } from "express";
import { getSummary } from "./admin.controllar.js";
import { auth, allowRoles } from "../../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/summary",
  auth,
  allowRoles("admin"),      // نفس الـ role اللي في الـ JWT
  getSummary
);

export default router;
