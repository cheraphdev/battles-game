const config = require("../config");
const Discord = require("discord.js");

module.exports = {
    data: {
        description: "Setup embed message for the wasp command.",
        descriptionLocalizations: {
            fr: "Configurer le message d'intégration pour la commande wasp."
        },
        options: [
            {
                type: 7,
                name: "channel",
                required: true,
                description: "Channel where the embed message will be sent.",
                descriptionLocalizations: {
                    fr: "Salon où le message d'intégration sera envoyé."
                },
            }
        ]
    },

    async exe(client, interaction) {
        if (!interaction.member.permissions.has("Administrator")) {
            interaction.reply({
                fr: {
                    content: `Vous n'avez pas l'autorisation (administrateur) d'utiliser cette commande. Veuillez demander à un administrateur d'utiliser la commande \`/setupembed\`.`,
                    ephemeral: true
                }
            }[interaction.locale] || {
                content: `You don't have the permission (Administrator) to use this command. Please ask an administrator to use the \`/setupembed\` command.`,
                ephemeral: true
            }
            )
        }

        const channel = interaction.options.getChannel("channel");

        let button = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("viewWasp")
                    .setLabel("View your wasp")
                    .setEmoji("🐝")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setDisabled(false),

                new Discord.ButtonBuilder()
                    .setCustomId("leaderboard")
                    .setLabel("Leaderboard")
                    .setEmoji("🏆")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setDisabled(false)
            )

        let embedReboot = new Discord.EmbedBuilder()
            .setColor(config.colors.default)
            .setAuthor({ name: `Wasp fight!` })
            .setDescription(`**It's spring, the wasps are out!**\n\nRandomly, flowers will appear on server messages.\n**Find the messages with the reaction 🌼** and click on it to earn flowers !\n\nThe flowers can be used to heal your wasp. As long as you are alive, you can attack the other players!\n\n**List of commands :**\n🐝 \`/fight\` to attack another server member!\n🐝 \`/profile\` or **click on the button** below to see your wasp!\n🐝 \`/leaderboard\` or **click on the button** below to see the leaderboard!\n🐝 \`/invite\` to invite the bot on your server!\n🐝 \`/support\` to join the community server!\n🐝 \`/vote\` to vote for the bot and win flowers!\n\n**Good battle to all!**`)
            .setImage("https://images-ext-1.discordapp.net/external/HZlTjz0uPVVMVfIAb2R3XJmCyReZ77Cfb6MNT8E80Bo/https/i.imgur.com/pFtyGbY.png?width=1440&height=430")

        channel.send({ embeds: [embedReboot], components: [button] });
        await interaction.reply({ content: `The embed message has been sent in ${channel}!\n*If you don't see the embed, check the bot permissions.*`, ephemeral: true })
    }
}