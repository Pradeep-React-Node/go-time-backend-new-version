const express = require("express");
const password = require("../controllers/password.js");
const upload = require("../controllers/upload.js");
const user = require("../controllers/user.js");

// const auth = require("../auth/auth.js");
const userRouter = new express.Router();

userRouter.post("/", user?.createUser);
userRouter.post("/paginate", user?.getUsersPagination);
userRouter.post("/password/reset", password?.changeUserPassword);
userRouter.get("/", user?.getUsers);
userRouter.delete("/delete", user?.deleteUser);
userRouter.post("/profile_picture", upload);

module.exports = userRouter;
