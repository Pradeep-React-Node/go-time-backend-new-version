const express = require("express");
const response = require("../controllers/response.js");
const responseRouter = new express.Router();

responseRouter.post("/", response?.createResponse);
responseRouter.post("/winner", response?.makeWinner);
responseRouter.get("/", response?.getResponses);

module.exports = responseRouter;
