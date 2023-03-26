const { REST, Routes, ActivityType, EmbedBuilder } = require("discord.js");
const dropSchema = require("../models/dropSchema");
const config = require("../config");
const mongoose = require("mongoose");
const fs = require("fs");

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

        console.log(`[BOT] I am connected to ${client.user.tag}.`)

        mongoose.connect(config.db.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log(`[MONGODB] I successfully logged in!`)

        client.user.setPresence({
            activities: [{ name: `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} users`, type: ActivityType.Watching }]
        });

        const commandsFiles = fs.readdirSync("./commands/").filter((file) => file.endsWith(".js"));
        for (const file of commandsFiles) {
            let { data } = require(`../commands/${file}`);
            data.name = file.replace(/\.[^.]*$/, "");
            client.application.commands.create(data).then(() => {
                console.log(`[SLASH] /${data.name} functional!`);
            }).catch(({ stack }) => {
                console.error(`[ERROR] The slash command "${data.name}" encounter an error:`, stack);
            });
        };

        //|▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬| Supprimer les slashcommands |▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬|

        const rest = new REST({ version: '10' }).setToken(config.bot.token);

        /*rest.put(Routes.applicationCommands(client.user.id), { body: [] })
            .then(() => console.log('I have removed all the slash commands!'))
            .catch(console.error);*/

        const sendEmbed = async () => {
            const channel = client.channels.cache.get(config.channels.coffreChannel);
            const embed = new EmbedBuilder()
                .setTitle("A mystery box appears!")
                .setDescription(`⭐ Click on **the reaction that appears** just below first to collect \`${config.economy.boxFlower}\` flowers.`)
                .setFooter({ text: 'There is only 1 person who can collect the drop!', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setColor(config.colors.default);
            const sentMessage = await channel.send({ embeds: [embed] });
            sentMessage.react(config.reaction.box);
            const data = new dropSchema({
                MessagesId: sentMessage.id
            });
            data.save();
        };

        let sentMessage;
        setInterval(() => {
            const delayInMs = Math.floor(Math.random() * (8 - 1 + 1) + 1) * 60 * 60 * 1000;
            setTimeout(() => {
                sendEmbed().then((message) => {
                    sentMessage = message;
                });
            }, delayInMs);
        }, 1 * 60 * 1000);
    }
}