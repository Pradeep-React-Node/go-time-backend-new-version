const express = require("express");
const challenge = require("../controllers/challenge.js");
const challengeRouter = new express.Router();

challengeRouter.post("/", challenge?.createChallenge);
challengeRouter.post("/get/paginate", challenge?.getChallengesPaginate);
challengeRouter.get("/get", challenge?.getChallenges);

module.exports = challengeRouter;
