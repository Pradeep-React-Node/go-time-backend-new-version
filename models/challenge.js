const mongoose = require("mongoose");

const winnerSchema = mongoose.Schema({
  created_by: String,
  response_id: String,
});

var challengesSchema = new mongoose.Schema(
  {
    content_type: String,
    created_by: String,
    title: String,
    description: String,
    images: Array,
    videos: Array,
    category_id: String,
    winner: winnerSchema,
    joining_amount: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Challenge", challengesSchema);
