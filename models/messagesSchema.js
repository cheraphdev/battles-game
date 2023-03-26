const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
//Informations du message:
    MessagesId: { type: String },

//Informations sur les donner des utilisateur:
    ReactionUser: { type: Array, default: [] }
});

module.exports = mongoose.model("messagesSchema", messagesSchema);