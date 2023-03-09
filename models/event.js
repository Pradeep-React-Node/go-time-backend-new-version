const mongoose = require("mongoose");

var eventSchema = new mongoose.Schema(
  {
    event_name: String,
    category: String,
    created_by: String,
    description: String,
    start_time: String,
    end_time: String,
    event_date: Date,
    max_players: Number,
    location: {
      type: { type: String },
      coordinates: [],
    },
    address: String,
    location_hint: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

eventSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Event", eventSchema);
