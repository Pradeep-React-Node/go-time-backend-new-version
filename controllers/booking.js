const Booking = require('../models/booking');
// Create a POST route for creating a booking
module.exports = {
  createBooking: (req, res) => {
    const booking = new Booking({
      arena_id: req.body.arena_id,
      sport_id: req.body.sport_id,
      timing: req.body.timing,
      createdOn: new Date(),
      modifiedOn: new Date(),
      Completed: false,
      Canceled: false,
      isActive: true,
    });
    booking.save((err, savedBooking) => {
      if (err) {
        res.status(500).send('Error creating booking');
      } else {
        res.status(201).json(savedBooking);
      }
    });
  },

  // modifide booking
  modifiedBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).send({ error: 'Booking not found' });
      }

      const {
        arena_id,
        sport_id,
        timing,
        modifiedOn,
        Completed,
        Canceled,
        isActive,
      } = req.body;

      if (arena_id) {
        booking.arena_id = arena_id;
      }
      if (sport_id) {
        booking.sport_id = sport_id;
      }
      if (timing) {
        booking.timing = timing;
      }
      if (modifiedOn) {
        booking.modifiedOn = modifiedOn;
      }
      if (Completed !== undefined) {
        booking.Completed = Completed;
      }
      if (Canceled !== undefined) {
        booking.Canceled = Canceled;
      }
      if (isActive !== undefined) {
        booking.isActive = isActive;
      }

      await booking.save();
      res.send(booking);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Server error' });
    }
  },

  //   Cancel Booking
  cancelBooking: async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).send({ error: 'Booking not found' });
      }

      booking.Canceled = true;
      booking.Completed = false;
      booking.isActive = false;
      booking.modifiedOn = new Date();

      await booking.save();
      res.send(booking);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Server error' });
    }
  },

  //   Get slot
  getSlots: async (req, res) => {
    try {
      const { arena_id, sport_id, date } = req.query;

      const bookings = await Booking.find({
        arena_id,
        sport_id,
        timing: {
          start_time: {
            $gte: new Date(date),
          },
          end_time: {
            $lt: new Date(date + 'T23:59:59Z'),
          },
        },
      });

      const bookedSlots = bookings.map((booking) => {
        return {
          start_time: booking.timing.start_time,
          end_time: booking.timing.end_time,
        };
      });

      const startOfDay = new Date(date);
      const endOfDay = new Date(date + 'T23:59:59Z');
      const slots = [];

      for (
        let t = startOfDay;
        t <= endOfDay;
        t.setMinutes(t.getMinutes() + 30)
      ) {
        const slotStart = new Date(t);
        const slotEnd = new Date(t.getTime() + 30 * 60000);

        if (
          !bookedSlots.some(
            (slot) => slot.start_time <= slotStart && slot.end_time >= slotEnd
          )
        ) {
          slots.push(
            `${slotStart.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })} to ${slotEnd.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`
          );
        }
      }

      res.send({ Available_slots: slots });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Server error' });
    }
  },
};
