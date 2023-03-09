const express = require("express");
const payment = require("../controllers/payment");
// const auth = require("../auth/auth.js");
const paymentRouter = new express.Router();

paymentRouter.post("/card", payment?.makeCardPayment);
paymentRouter.post("/subscribe", payment?.subscribeCustomer);
paymentRouter.post("/withdraw", payment?.withdrawAmount);

module.exports = paymentRouter;
