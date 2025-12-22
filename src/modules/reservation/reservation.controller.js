import Reservation from "../../../DB/model/reservation.model.js";
import Student from "../../../DB/model/student.model.js";
import Room from "../../../DB/model/room.model.js";

// =====================================
// إنشاء حجز جديد
// =====================================
export const createReservation = async (req, res) => {
  const { studentId, roomId, startTime, endTime } = req.body;

  if (!studentId || !roomId || !startTime || !endTime) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  // 1️⃣ الطالب
  const student = await Student.findOne({ studentId });
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // 2️⃣ الغرفة
  const room = await Room.findById(roomId);
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  // 3️⃣ منع تداخل الحجوزات
  const conflict = await Reservation.findOne({
    roomId,
    status: "active",
    $or: [
      {
        startTime: { $lt: endTime, $gte: startTime },
      },
      {
        endTime: { $gt: startTime, $lte: endTime },
      },
      {
        startTime: { $lte: startTime },
        endTime: { $gte: endTime },
      },
    ],
  });

  if (conflict) {
    return res.status(409).json({
      message: "Room already reserved in this time",
    });
  }

  // 4️⃣ إنشاء الحجز
  const reservation = await Reservation.create({
    roomId,
    userId: student._id,
    startTime,
    endTime,
  });

  // 5️⃣ تحديث حالة الغرفة
  room.status = "reserved";
  await room.save();

  return res.status(201).json({
    message: "Reservation created successfully",
    reservation,
  });
};
