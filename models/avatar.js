const mongoose = require("mongoose");

var avatarSchema = new mongoose.Schema({
    image: String,
    is_deleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Avatar", avatarSchema);