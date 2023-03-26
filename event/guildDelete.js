const Discord = require("discord.js");
const guildSchema = require("../models/guildSchema");
const config = require("../config");

module.exports = {
    name: 'guildDelete',
    once: true,
    async execute(client, guild) {
        const dataGuildDelete = await guildSchema.findOne({
            GuildId: guild.id
        }).catch((err) => { });
        if (!dataGuildDelete) return;
        await dataGuildDelete.delete();

        const guildDelete = new Discord.EmbedBuilder()
            .setTitle("<:close:1071523654573236285> Log guildDelete")
            .setDescription(`${client.user.username} à quitter **${guild.name}** !\n\`\`\`MEMBRE(S) = ${guild.memberCount}\nGUILD = ${guild.id}\`\`\``)
            .setColor(config.colors.default)

        client.channels.cache.get(config.channels.logsGuild).send({ embeds: [guildDelete] }).catch(error => {
            return;
        });
    }
}