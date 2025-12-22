import Student from "../../../DB/model/student.model.js";
import Reservation from "../../../DB/model/reservation.model.js";

export const checkAccess = async (req, res) => {
  const { fingerprintId, roomId } = req.body;

  if (!fingerprintId || !roomId) {
    return res.status(400).json({
      allowed: false,
      message: "Invalid request",
    });
  }

  const student = await Student.findOne({ fingerprintId });
  if (!student) {
    return res.json({
      allowed: false,
      message: "عفوًا، بصمة غير معروفة",
    });
  }

  const now = new Date();

  const reservation = await Reservation.findOne({
    userId: student._id,
    roomId,
    status: "active",
    startTime: { $lte: now },
    endTime: { $gte: now },
  });

  if (!reservation) {
    return res.json({
      allowed: false,
      message: "عفوًا، لا يوجد حجز حالي",
    });
  }

  return res.json({
    allowed: true,
    message: `hello ${student.name} `,
  });
};
