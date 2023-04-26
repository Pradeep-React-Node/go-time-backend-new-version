const Slot = require('../models/slot');

// Create a POST route for creating a new arena
module.exports = {
  createSlot: async (req, res) => {
    const { sport, date, startTime, endTime, maxPlayers, userId } = req.body;
    const slot = new Slot({
      sport,
      date,
      startTime,
      endTime,
      maxPlayers,
      userId,
    });
    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
    try {
      const newSlot = await slot.save();
      res.status(201).json({ message: 'Slot created', slot: newSlot });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Create a PUT route for updating an arena
  //   updateArena: (req, res) => {
  //     Arena.findByIdAndUpdate(
  //       req.params.id,
  //       req.body,
  //       { new: true },
  //       (err, updatedArena) => {
  //         if (err) {
  //           res.status(500).send('Error updating arena');
  //         } else {
  //           res.status(200).send('Arena updated successfully');
  //         }
  //       }
  //     );
  //   },
  //   // Create a DELETE route for deleting an arena
  //   deleteArena: (req, res) => {
  //     const arenaId = req.params.id;
  //     const update = {
  //       isActive: false,
  //       modefiesOn: new Date(),
  //     };
  //     Arena.findByIdAndUpdate(
  //       arenaId,
  //       update,
  //       { new: true },
  //       (err, updatedArena) => {
  //         if (err) {
  //           res.status(500).send('Error deleting arena');
  //         } else if (!updatedArena) {
  //           res.status(404).send('Arena not found');
  //         } else {
  //           res.status(200).send('Arena deleted successfully');
  //         }
  //       }
  //     );
  //   },
  //   // get arena
  //   getArenas: (req, res) => {
  //     Arena.find({}, (err, arenas) => {
  //       if (err) {
  //         res.status(500).send('Error retrieving arenas');
  //       } else {
  //         res.status(200).json(arenas);
  //       }
  //     });
  //   },
};
