const express = require('express');
const avatar = require('../controllers/avatar.js');
// const auth = require("../auth/auth.js");
const avatarRouter = new express.Router();

avatarRouter.post('/', avatar?.createAvatar);
avatarRouter.get('/', avatar?.getAvatars);

module.exports = avatarRouter;
