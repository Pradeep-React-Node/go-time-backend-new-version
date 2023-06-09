const mongoose = require('mongoose');

const sportsSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  images: [String],
  timing: [
    {
      date: Date,
      slots: [
        {
          start: String,
          end: String,
          booked: {
            type: Boolean,
            default: false,
          },
          bookingId: {
            type: String,
            default: null,
          },
        },
      ],
    },
  ],
  created_on: {
    type: Date,
    default: Date.now,
  },
  modified_on: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
const bookingSchema = new mongoose.Schema({
  user_id: String,
  sport_id: String,
  timing: {
    start_time: String,
    end_time: String,
  },
  created_on: String,
  date: String,
  id: String,
  duration: String,
  isCanceled: {
    type: Boolean,
    default: false,
  },
});

const storeSchema = new mongoose.Schema(
  {
    store_name: String,
    description: String,
    website_url: String,
    category: [String],
    image: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' },
    },
    address: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
    host_id: String,
    sports: [sportsSchema],
    bookings: [bookingSchema],
  },
  { timestamps: true }
);

// storeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Store', storeSchema);
