const mongoose = require("mongoose");

var responseSchema = new mongoose.Schema(
  {
    content_type: String,
    created_by: String,
    challenge_id: String,
    title: String,
    description: String,
    images: Array,
    videos: Array,
    is_winner: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Response", responseSchema);
