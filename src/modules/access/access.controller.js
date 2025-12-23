import mongoose from "mongoose";
import Student from "../../../DB/model/student.model.js";
import Reservation from "../../../DB/model/reservation.model.js";

export const checkAccess = async (req, res) => {
  try {
    const { fingerprintId, roomId } = req.body;

    if (!fingerprintId || !roomId) {
      return res.status(400).json({
        allowed: false,
        message: "Invalid request",
      });
    }


    const fp = isNaN(Number(fingerprintId)) ? fingerprintId : Number(fingerprintId);

    const student = await Student.findOne({ fingerprintId: fp });
    if (!student) {
      return res.json({
        allowed: false,
        message: "عفوًا، بصمة غير معروفة",
      });
    }

    const roomObjectId = new mongoose.Types.ObjectId(roomId);

\    const now = new Date();

    console.log("NOW(UTC):", now.toISOString());
    console.log("Student:", student._id.toString(), "fp:", fp, "room:", roomId);

    const reservation = await Reservation.findOne({
      userId: student._id,
      roomId: roomObjectId,
      status: "active",
      startTime: { $lte: now },
      endTime: { $gte: now },
    }).sort({ startTime: -1 });

    if (!reservation) {
      const latest = await Reservation.findOne({
        userId: student._id,
        roomId: roomObjectId,
        status: "active",
      }).sort({ startTime: -1 });

      if (latest) {
        console.log("LATEST active reservation:", {
          startTime: latest.startTime?.toISOString?.() || latest.startTime,
          endTime: latest.endTime?.toISOString?.() || latest.endTime,
          now: now.toISOString(),
        });
      } else {
        console.log("No active reservations for this user+room");
      }

      return res.json({
        allowed: false,
        message: "عفوًا، لا يوجد حجز حالي",
      });
    }

    return res.json({
      allowed: true,
      message: `hello ${student.name}`,
    });
  } catch (err) {
    console.error("checkAccess error:", err);
    return res.status(500).json({
      allowed: false,
      message: "Server error",
    });
  }
};
