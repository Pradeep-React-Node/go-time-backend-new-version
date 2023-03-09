const express = require('express');
const booking = require('../controllers/booking');
const bookingRouter = new express.Router();

bookingRouter.get('/slots', booking.getSlots);
bookingRouter.post('/create_booking', booking.createBooking);
bookingRouter.put('/bookings/:id', booking.modifiedBooking);
bookingRouter.delete('/bookings/:id/cancel', booking.cancelBooking);

module.exports = bookingRouter;
