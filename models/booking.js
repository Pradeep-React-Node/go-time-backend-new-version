const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    arena_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Arena',
      required: true,
    },
    sport_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sport',
      required: true,
    },
    timing: {
      start_time: {
        type: Date,
        required: true,
      },
      end_time: {
        type: Date,
        required: true,
      },
    },
    createdOn: {
      type: Date,
      required: true,
    },
    modifiedOn: {
      type: Date,
      required: true,
    },
    Completed: {
      type: Boolean,
      required: true,
    },
    Canceled: {
      type: Boolean,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

// const Booking = mongoose.model('Booking', bookingSchema);

// module.exports = Booking;
