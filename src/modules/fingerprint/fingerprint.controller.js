import Student from "../../../DB/model/student.model.js";

const FINGERPRINT_DEVICE_URL =
  process.env.FINGERPRINT_DEVICE_URL || "http://192.168.1.50";

export const enrollViaDevice = async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ message: "Student ID required" });
  }

  const student = await Student.findOne({ studentId });
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  try {
    const deviceRes = await fetch(
      `${FINGERPRINT_DEVICE_URL}/fingerprint/enroll`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      }
    );

    if (!deviceRes.ok) {
      const errBody = await deviceRes.json().catch(() => ({}));
      return res
        .status(502)
        .json({ message: errBody.message || "Device enroll failed" });
    }

    const data = await deviceRes.json();

    if (!data.fingerprintId) {
      return res
        .status(500)
        .json({ message: "Device did not return fingerprintId" });
    }

    return res.json({
      message: "Fingerprint captured",
      fingerprintId: data.fingerprintId,
    });
  } catch (err) {
    return res.status(500).json({ message: "Device unreachable" });
  }
};
