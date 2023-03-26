const userSchema = require("../models/userSchema");
const messagesSchema = require("../models/messagesSchema");

module.exports = {
    name: 'messageReactionAdd',
    async execute(client, reaction, user) {
        if (user.bot) return;

        if (reaction.emoji.name === '🌼') {
            let db = await messagesSchema.findOne({ MessagesId: reaction.message.id });
            if (db) {
                if (db.ReactionUser.includes(user.id)) {
                    return console.log(`[LOGS] ${user.tag} à voulu réagir à un message qu'il à déjà réagi.`)
                }
                db.ReactionUser.push(user.id);
                await db.save();

                const flowersToAdd = 1;

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

                console.log(db);
                console.log(`[LOGS] 1 fleur à été donner à ${user.tag} car il à réagis a un message contenant 🌻`);
            }
        }
    }
}