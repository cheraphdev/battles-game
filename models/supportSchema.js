const mongoose = require("mongoose");
const config = require("../config");

const supportSchema = new mongoose.Schema({
    SupportId: { type: String, default: config.guildid },
    UserId: { type: Array, default: [] }
});

module.exports = mongoose.model("supportSchema", supportSchema);