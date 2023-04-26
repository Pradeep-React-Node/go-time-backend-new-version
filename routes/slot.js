const express = require('express');
const slot = require('../controllers/slot');
const slotRouter = new express.Router();

// arenaRouter.get('/get_arena', arena.getArenas);
slotRouter.post('/create_slot', slot.createSlot);
// arenaRouter.put('/update_arena/:id', arena.updateArena);
// arenaRouter.delete('/delete_arena/:id', arena.deleteArena);

module.exports = slotRouter;
