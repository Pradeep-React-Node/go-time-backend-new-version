const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  bookedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // ref: 'Player'
    },
  ],
  maxPlayers: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'User'
  },
});

module.exports = mongoose.model('Slot', slotSchema);
