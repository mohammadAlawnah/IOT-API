import Student from "../../../DB/model/student.model.js";

let enrollCommand = {
  pending: false,
  studentId: null,
  requestedAt: null,
};

let lastEnrollResult = {
  studentId: null,
  fingerprintId: null,
  success: false,
  message: null,
  updatedAt: null,
};

// =========================
// 1) Admin triggers ENROLL
// =========================
export const startEnroll = async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ message: "Student ID required" });
  }

  const trimmedId = String(studentId).trim();

  enrollCommand.pending = true;
  enrollCommand.studentId = trimmedId;
  enrollCommand.requestedAt = new Date().toISOString();

  lastEnrollResult = {
    studentId: trimmedId,
    fingerprintId: null,
    success: false,
    message: null,
    updatedAt: null,
  };

  return res.json({
    message: "Enroll command queued",
    studentId: trimmedId,
  });
};

// =========================
// 2) ESP32 polls for command
// =========================
export const getCommand = async (req, res) => {
  if (enrollCommand.pending && enrollCommand.studentId) {
    return res.json({
      action: "ENROLL",
      studentId: enrollCommand.studentId,
      requestedAt: enrollCommand.requestedAt,
    });
  }

  return res.json({
    action: "IDLE",
  });
};

// =========================
// 3) ESP32 sends enroll result
// =========================
export const enrollResult = async (req, res) => {
  const { studentId, success, fingerId, message } = req.body;

  const finalStudentId = studentId || enrollCommand.studentId || null;

  const fpId =
    fingerId !== undefined && fingerId !== null ? String(fingerId) : null;

  lastEnrollResult = {
    studentId: finalStudentId,
    fingerprintId: fpId,
    success: !!success,
    message: message || null,
    updatedAt: new Date().toISOString(),
  };

  // clear command
  enrollCommand.pending = false;
  enrollCommand.studentId = null;
  enrollCommand.requestedAt = null;

  console.log("===== New Fingerprint Result From ESP32 =====");
  console.log("Success:", lastEnrollResult.success);
  console.log("Student ID:", lastEnrollResult.studentId);
  console.log("Finger ID:", lastEnrollResult.fingerprintId);
  console.log("Message:", lastEnrollResult.message);
  console.log("=============================================");

  return res.json({ ok: true });
};

// =========================
// 4) Admin checks result
// =========================
export const getEnrollResult = async (req, res) => {
  const { studentId } = req.query;

  if (!studentId) {
    return res.status(400).json({ message: "Student ID required" });
  }

  const trimmedId = String(studentId).trim();

  if (!lastEnrollResult.studentId || lastEnrollResult.studentId !== trimmedId) {
    return res.json({ ready: false });
  }

  if (lastEnrollResult.fingerprintId == null) {
    return res.json({ ready: false });
  }

  return res.json({
    ready: true,
    success: lastEnrollResult.success,
    fingerprintId: lastEnrollResult.fingerprintId,
    message: lastEnrollResult.message,
  });
};

// =========================
// 5) Admin saves fingerprint to DB
//    ✅ ADDED: block duplicate fingerprintId for another student
// =========================
export const saveFingerprint = async (req, res) => {
  const { studentId, fingerprintId, name } = req.body;

  if (!studentId || fingerprintId == null) {
    return res
      .status(400)
      .json({ message: "Student ID and fingerprint ID are required" });
  }

  const trimmedId = String(studentId).trim();
  const fpId = String(fingerprintId).trim();

  // ✅ NEW: prevent assigning same fingerprintId to different student
  const existingFp = await Student.findOne({ fingerprintId: fpId });
  if (existingFp && existingFp.studentId !== trimmedId) {
    return res.status(409).json({
      message: `This fingerprintId (${fpId}) is already assigned to studentId ${existingFp.studentId}`,
    });
  }

  let student = await Student.findOne({ studentId: trimmedId });
  let created = false;

  if (!student) {
    student = new Student({
      studentId: trimmedId,
      name: name || `Student ${trimmedId}`,
      role: "student",
      fingerprintId: fpId,
    });
    await student.save();
    created = true;
  } else {
    student.fingerprintId = fpId;
    if (name) student.name = name;
    await student.save();
  }

  return res.json({
    message: created
      ? "Student created and fingerprint saved"
      : "Fingerprint updated for existing student",
    student: {
      _id: student._id,
      studentId: student.studentId,
      name: student.name,
      role: student.role,
      fingerprintId: student.fingerprintId,
    },
  });
};
