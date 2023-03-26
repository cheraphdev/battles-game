const userSchema = require("../models/userSchema");
const messagesSchema = require("../models/messagesSchema");
const dropSchema = require("../models/dropSchema");
const config = require("../config");

module.exports = {
    name: 'messageReactionAdd',
    async execute(client, reaction, user) {
        if (user.bot) return;

        if (reaction.emoji.name === config.reaction.flower) {
            let db = await messagesSchema.findOne({ MessagesId: reaction.message.id });
            if (db) {
                if (db.ReactionUser.includes(user.id)) {
                    return console.log(`[LOGS] ${user.tag} à voulu réagir à un message qu'il à déjà réagi.`)
                }
                db.ReactionUser.push(user.id);
                await db.save();

                const flowersToAdd = config.economy.reactFlower;

                let data = await userSchema.findOneAndUpdate(
                    {
                        UserId: user.id,
                    },
                    {
                        $inc: {
                            Flowers: flowersToAdd,
                        },
                    }
                );

                if (!data) {
                    let data = new userSchema({
                        UserId: user.id,
                        Flowers: flowersToAdd
                    });
                    data.save();
                }

                console.log(`[LOGS] ${config.economy.reactFlower} fleur à été donner à ${user.tag} car il à réagis a un message contenant 🌻`);
            }
        }

        if (reaction.emoji.name === config.reaction.box) {
            let db = await dropSchema.findOne({ MessagesId: reaction.message.id });
            if (db) {
                db.delete()

                const flowersToAdd = config.economy.boxFlower;

                let data = await userSchema.findOneAndUpdate(
                    {
                        UserId: user.id,
                    },
                    {
                        $inc: {
                            Flowers: flowersToAdd,
                        },
                    }
                );

                if (!data) {
                    let data = new userSchema({
                        UserId: user.id,
                        Flowers: flowersToAdd
                    });
                    data.save();
                }

                console.log(`[LOGS] ${config.economy.boxFlower} fleur à été donner à ${user.tag} car il à récupèrer un drop.`);
            }
        }
    }
}