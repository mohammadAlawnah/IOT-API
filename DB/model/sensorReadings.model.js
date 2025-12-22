import { Schema, model } from "mongoose";

const sensorReadingSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      required: true,
    },

    temperature: {
      type: Number,
      default: null,
    },

    humidity: {
      type: Number,
      default: null,
    },

    noiseLevel: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const SensorReading = model("SensorReading", sensorReadingSchema);
export default SensorReading;
