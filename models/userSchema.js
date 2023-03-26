const mongoose = require("mongoose");
const config = require("../config");

const userSchema = new mongoose.Schema({
//Informations de l'utilisateur:
    UserId: { type: String },
    Premium: { type: Boolean, default: false },

//Stats de l'utilisateur:
    Messages: { type: Number, default: 0 },
    Flowers: { type: Number, default: 0 },
    Kills: { type: Number, default: 0 },
    Dead: { type: Number, default: 0 },

//Profile de l'utilisateur:
    Heart1: { type: String, default: config.emojis.emojiCanvas.heartNormal },
    Heart2: { type: String, default: config.emojis.emojiCanvas.heartNormal },
    Heart3: { type: String, default: config.emojis.emojiCanvas.heartNormal },
    Heart4: { type: String, default: config.emojis.emojiCanvas.heartNormal },
    TotalHeart: { type: Number, default: 4 }
});

module.exports = mongoose.model("userSchema", userSchema);