const {  } = require("discord.js");
const userSchema = require("../models/userSchema");
const messagesSchema = require("../models/messagesSchema");
const config = require("../config");

module.exports = {
    name: 'messageCreate',
    async execute(client, message, user) {
        if (message.author.bot) return
        if (message.channel.type == "DM") return;

        const author = message.author;
        const randomNum = Math.floor(Math.random() * 1 + 1);
        const messagesToAdd = randomNum;

        let data = await userSchema.findOneAndUpdate(
            {
                UserId: message.author.id,
            },
            {
                $inc: {
                    UserMessages: messagesToAdd,
                },
            }
        );

        if (!data) {
            let data = new userSchema({
                UserId: message.author.id,
                Messages: messagesToAdd
            });
            data.save();
        }

        const randomNumber = Math.floor(Math.random() * 30);
        if (randomNumber === 0) {

            let data = new messagesSchema({
                MessagesId: message.id
            });
            data.save();

            message.react(config.reaction.flower);
        }
    }
}
