const express = require("express");
const category = require("../controllers/category.js");
// const auth = require("../auth/auth.js");
const categoryRouter = new express.Router();


categoryRouter.post("/", category?.createCategory);
categoryRouter.get("/", category?.getCategories);

module.exports = categoryRouter