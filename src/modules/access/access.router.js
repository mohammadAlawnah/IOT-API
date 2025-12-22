import { Router } from "express";
import { checkAccess } from "./access.controller.js";

const router = Router();

router.post("/check", checkAccess);

export default router;
