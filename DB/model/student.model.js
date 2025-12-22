import { Schema, model } from "mongoose";

const studentSchema = new Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    password: {
      type: String,
      default: null
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },

    fingerprintId: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const Student = model("Student", studentSchema);
export default Student;
