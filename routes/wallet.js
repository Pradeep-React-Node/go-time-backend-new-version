const express = require("express");
const wallet = require("../controllers/wallet");

const walletRouter = new express.Router();

walletRouter.get("/get", wallet?.getWallet);

walletRouter.post("/update", wallet?.updateWallet);

module.exports = walletRouter;
