const mongoose = require("mongoose");

var categorySchema = new mongoose.Schema({
    image: String,
    name: String,
    is_deleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Category", categorySchema);