import Room from "../../../DB/model/room.model.js";
import Reservation from "../../../DB/model/reservation.model.js"; // عدّل المسار حسب اسم الملف عندك

export const getSummary = async (req, res) => {
  try {
    // 1) إحصائيات الغرف
    const [roomsTotal, roomsAvailable, roomsOccupied] = await Promise.all([
      Room.countDocuments(),
      Room.countDocuments({ status: "available" }),
      Room.countDocuments({ status: "occupied" }) // لو بدك تضيف reserved احسبها كمان
      // Room.countDocuments({ status: { $in: ["occupied", "reserved"] } })
    ]);

    // 2) حجوزات اليوم
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayReservations = await Reservation.find({
      startTime: { $gte: startOfDay, $lte: endOfDay },
    })
      .sort({ startTime: 1 })
      .lean();

    const todayReservationsCount = todayReservations.length;

    // أول حجز لسه ما بدأ أو شغال نعتبره upcoming
    const now = new Date();
    const upcomingReservation =
      todayReservations.find((r) => new Date(r.endTime) > now) || null;

    return res.json({
      roomsTotal,
      roomsAvailable,
      roomsOccupied,
      todayReservations: todayReservationsCount,
      upcomingReservation: upcomingReservation
        ? {
            _id: upcomingReservation._id,
            roomId: upcomingReservation.roomId,
            roomName: upcomingReservation.roomName,
            startTime: upcomingReservation.startTime,
            endTime: upcomingReservation.endTime,
          }
        : null,
    });
  } catch (err) {
    console.error("getSummary error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
