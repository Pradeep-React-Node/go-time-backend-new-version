const express = require('express');
const event = require('../controllers/event.js');
// const auth = require("../auth/auth.js");
const eventRouter = new express.Router();

eventRouter.post('/', event?.createEvent);
eventRouter.post('/get/paginate', event?.getEventsPagination);
eventRouter.get('/get', event?.getEvents);
eventRouter.post('/join', event?.joinEvent);
eventRouter.get('/join/get', event?.getEventJoins);
eventRouter.delete('/leave', event?.leaveEvent);
eventRouter.get('/get/slots/:createdBy/:categoryId', event?.getByUser);

module.exports = eventRouter;
