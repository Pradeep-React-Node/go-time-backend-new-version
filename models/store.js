const mongoose = require("mongoose");

var storeSchema = new mongoose.Schema(
  {
    store_name: String,
    description: String,
    website_url: String,
    category: Array,
    image: String,
    location: {
      type: { type: String },
      coordinates: [],
    },
    address: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

storeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Store", storeSchema);
