const mongoose = require("mongoose");
const config = require("../config");

const guildSchema = new mongoose.Schema({
//Informations sur le serveur:
    GuildId: { type: String },
    Premium: { type: Boolean, default: false },
    Statut: { type: Boolean, default: false}
});

module.exports = mongoose.model("guildSchema", guildSchema);