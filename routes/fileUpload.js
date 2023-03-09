const express = require("express");
const fileUpload = require("../controllers/fileUpload");
// const auth = require("../auth/auth.js");
const fileUploadRouter = new express.Router();


fileUploadRouter.post("/", fileUpload);

module.exports = fileUploadRouter