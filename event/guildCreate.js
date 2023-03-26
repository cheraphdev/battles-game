const Discord = require("discord.js");
const guildSchema = require("../models/guildSchema");
const config = require("../config");

module.exports = {
    name: 'guildCreate',
    once: true,
    async execute(client, guild) {
        let dataGuildCreate = new guildSchema({
            GuildId: guild.id
        });
        dataGuildCreate.save();

        const guildCreate = new Discord.EmbedBuilder()
            .setTitle("<:validate:1071571218316152892> Log guildCreate")
            .setDescription(`${client.user.username} à rejoint **${guild.name}** !\n\`\`\`MEMBRE(S) = ${guild.memberCount}\nGUILD = ${guild.id}\`\`\``)
            .setColor(config.colors.default)

        client.channels.cache.get(config.channels.logsGuild).send({ embeds: [guildCreate] }).catch(error => {
            return;
        });
    }
}