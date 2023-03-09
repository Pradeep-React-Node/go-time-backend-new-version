// Create a schema for the Arena
const mongoose = require('mongoose');
const arenaSchema = new mongoose.Schema({
  Lat: String,
  Log: String,
  name: String,
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  Sports: [
    {
      sport_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport',
        required: true,
      },
      name: String,
      Description: String,
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
      isActive: Boolean,
      createdOn: {
        type: Date,
        required: true,
      },
      modifiedOn: {
        type: Date,
        required: true,
      },
      Images: [String],
    },
  ],
  isActive: Boolean,
  createdOn: {
    type: Date,
    required: true,
  },
  modifiedOn: {
    type: Date,
    required: true,
  },
  Description: String,
  Images: [String],
});

// Create a model for the Arena
const Arena = mongoose.model('Arena', arenaSchema);
module.exports = Arena;
