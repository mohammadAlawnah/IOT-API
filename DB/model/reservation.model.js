import { Schema, model } from "mongoose";

const reservationSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "cancelled", "completed", "expired"],
      default: "active",
    },

    cancelledReason: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = model("Reservation", reservationSchema);
export default Reservation;
