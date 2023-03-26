const mongoose = require("mongoose");
const config = require("../config");

const dropSchema = new mongoose.Schema({
    MessageId: { type: String }
});

module.exports = mongoose.model("dropSchema", dropSchema);