const express = require("express");
const auth = require("../controllers/auth.js");
// const auth = require("../auth/auth.js");
const authRouter = new express.Router();

authRouter.post("/login", auth?.login);
authRouter.get("/", auth?.logout);
authRouter.post("/getOtp", auth?.generateOtp);
authRouter.get("/verifyOtp", auth?.verifyOtp);

module.exports = authRouter;
