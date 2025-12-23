import { Router } from "express";
import * as roomControllar from "./room.controllar.js";
import { auth, allowRoles } from "../../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/",
  auth,
  allowRoles("admin"),           // ⬅️ استعمل lowercase زي ما في JWT
  roomControllar.addRoom
);

router.get(
  "/",
  auth,
  allowRoles("admin"),
  roomControllar.getAllRooms
);

router.get(
  "/available",
  auth,
  allowRoles("admin", "student"),
  roomControllar.getAvailableRooms
);

router.get(
  "/reserved",
  auth,
  allowRoles("admin"),
  roomControllar.getReservedRooms
);

export default router;
