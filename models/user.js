const mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    full_name: String,
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    user_id: String,
    user_type: String,
    social_id: String,
    password: String,
    weight: String,
    height_feet: String,
    height_inches: String,
    profile_picture: String,
    age: String,
    contact_number: String,
    categories: Array,
    plan_id: {
      type: String,
      default: "1",
    },
    subscription_id: String,
    customer_id: String,
    // location: {
    //   type: { type: String },
    //   coordinates: Array,
    // },
    location: mongoose.Schema.Types.Mixed,
    address: String,
    login_type: {
      type: String,
      enum: ["Google", "Facebook", "Email"],
    },
    status: {
      type: String,
      enum: ["Active", "Deactivated", "Deleted"],
      default: "Active",
    },
    is_logged_in: {
      type: Boolean,
      default: false,
    },
    is_online: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
