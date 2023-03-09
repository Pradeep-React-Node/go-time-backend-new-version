const mongoose = require('mongoose');

// create a mongoose schema for the sports collection
const sportSchema = new mongoose.Schema(
  {
    sport_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sport',
      required: true,
    },
    name: { type: String, required: true },
    description: { type: String },
    timings: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// create a mongoose model for the sports collection
const Sport = mongoose.model('Sport', sportSchema);

module.exports = Sport;
