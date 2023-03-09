const mongoose = require("mongoose");

var joinEventSchema = new mongoose.Schema(
    {
        event_id: String,
        user_id: String,
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Join Event", joinEventSchema);
