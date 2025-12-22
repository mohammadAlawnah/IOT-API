import { Schema, model } from "mongoose";

const alertSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    reservationId: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
    },

    type: {
      type: String,
      enum: ["noise", "access", "temperature", "humidity"],
      required: true,
      default: "noise",
    },

    level: {
      type: String,
      enum: ["warning", "escalate"],
      required: true,
      default: "warning",
    },

    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },

    status: {
      type: String,
      enum: ["sent", "resolved"],
      default: "sent",
    },
  },
  {
    timestamps: true,
  }
);

const Alert = model("Alert", alertSchema);
export default Alert;
