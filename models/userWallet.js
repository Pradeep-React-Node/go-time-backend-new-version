const mongoose = require("mongoose");

var userWalletSchema = new mongoose.Schema(
  {
    user_id: String,
    amount: {
      type: String,
      default: "0",
    },
    currency: String,
  },
  { timestamps: true }
);

module.exports = new mongoose.model("User Wallet", userWalletSchema);
