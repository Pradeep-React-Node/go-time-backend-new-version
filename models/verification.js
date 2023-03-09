const mongoose = require("mongoose");

const verficationSchema = new mongoose.Schema(
  {
    user_id: String,
    otp: String,
    expired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Verification", verficationSchema);
