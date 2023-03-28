const express = require('express');
const arena = require('../controllers/arena');
const arenaRouter = new express.Router();

arenaRouter.post('/get_arena', arena.getArenas);
arenaRouter.post('/create_arena', arena.createArena);
arenaRouter.put('/update_arena/:id', arena.updateArena);
arenaRouter.delete('/delete_arena/:id', arena.deleteArena);

module.exports = arenaRouter;
