import Room from "../../../DB/model/room.model.js"; 

export const addRoom = async (req, res) => {
  try {
    const { name, status, sensors } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Room name is required" });
    }

    const existing = await Room.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Room already exists" });
    }

    const room = await Room.create({
      name,
      status: status || "available",
      sensors: {
        temp: sensors?.temp ?? true,
        humidity: sensors?.humidity ?? true,
        noiseSensor: sensors?.noiseSensor ?? true,
      },
    });

    return res.status(201).json({ message: "Room created", room });
  } catch (error) {
    console.error("addRoom error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ name: 1 });
    return res.json({ rooms });
  } catch (error) {
    console.error("getAllRooms error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "available" }).sort({ name: 1 });
    return res.json({ rooms });
  } catch (error) {
    console.error("getAvailableRooms error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getReservedRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      status: { $in: ["reserved", "occupied"] },
    }).sort({ name: 1 });


    return res.json({ rooms });
  } catch (error) {
    console.error("getReservedRooms error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
