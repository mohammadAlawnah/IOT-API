import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../../../DB/model/student.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const register = async (req, res) => {
  const { studentId, name, password, role = "student", fingerprintId } =
    req.body;

  if (!studentId || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const exists = await Student.findOne({ studentId });
  if (exists) {
    return res.status(409).json({ message: "Student already exists" });
  }

  let hash = null;

  if (role === "admin") {
    if (!password) {
      return res
        .status(400)
        .json({ message: "Password is required for admin" });
    }
    hash = await bcrypt.hash(password, 10);
  } else if (password) {
    hash = await bcrypt.hash(password, 10);
  }

  const student = await Student.create({
    studentId,
    name,
    role,
    password: hash,
    fingerprintId: fingerprintId || null
  });

  return res.status(201).json({
    message: "Student created",
    student: {
      _id: student._id,
      studentId: student.studentId,
      name: student.name,
      role: student.role,
      fingerprintId: student.fingerprintId
    }
  });
};

export const login = async (req, res) => {
  const { studentId, password } = req.body;

  if (!studentId) {
    return res.status(400).json({ message: "Student ID required" });
  }

  const user = await Student.findOne({ studentId });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (user.role === "admin") {
    if (!password) {
      return res.status(400).json({ message: "Password required for admin" });
    }

    if (!user.password) {
      return res
        .status(500)
        .json({ message: "Admin has no password configured" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      studentId: user.studentId,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return res.json({
    message: "Login successful",
    token,
    user: {
      _id: user._id,
      name: user.name,
      role: user.role,
      studentId: user.studentId,
      fingerprintId: user.fingerprintId
    }
  });
};

