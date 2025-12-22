import { Schema, model } from "mongoose";

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["available", "reserved", "occupied"],
      default: "available",
    },

    sensors: {
      temp: {
        type: Boolean,
        default: true,
      },
      humidity: {
        type: Boolean,
        default: true,
      },
      noiseSensor: {
        type: Boolean,
        default: true,
      },
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Room = model("Room", roomSchema);
export default Room;
