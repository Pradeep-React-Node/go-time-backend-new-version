const express = require('express');
const store = require('../controllers/store');
// const auth = require("../auth/auth.js");
const storeRouter = new express.Router();

storeRouter.post('/', store?.createStore);
storeRouter.post('/get', store?.getStoresPagination);
storeRouter.get('/get/:id', store?.getStoreById);
storeRouter.post('/slot/booking', store?.slotBooking);

module.exports = storeRouter;
