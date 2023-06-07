const express = require('express');
const store = require('../controllers/store');
// const auth = require("../auth/auth.js");
const storeRouter = new express.Router();

storeRouter.post('/', store?.createStore);
storeRouter.post('/get', store?.getStoresPagination);
storeRouter.get('/get/:id', store?.getStoreById);
storeRouter.get('/get/booking/:userId', store?.getBookingsByUserId);
storeRouter.post('/slot/booking', store?.slotBooking);
storeRouter.post('/add/store', store?.addStore);
storeRouter.post('/add/sports/:storeId', store?.createSport);
storeRouter.post('/add/slots/:storeId/:sportId', store?.createSlot);

module.exports = storeRouter;
