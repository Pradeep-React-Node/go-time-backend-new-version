const express = require('express');
const sports = require('../controllers/sports');
const sportsRouter = new express.Router();

sportsRouter.get('/getSport_list', sports.getSportList);

module.exports = sportsRouter;
