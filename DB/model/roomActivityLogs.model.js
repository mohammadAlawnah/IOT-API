import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true, // door_open, motion_detected, noise_warning, ...
    },

    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { _id: false }
);

const roomActivityLogSchema = new Schema(
  {
    reservationId: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },

    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    events: [eventSchema],

    durationMinutes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const RoomActivityLog = model("RoomActivityLog", roomActivityLogSchema);
export default RoomActivityLog;
