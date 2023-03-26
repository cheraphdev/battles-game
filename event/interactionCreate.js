const { Client, CommandInteraction, AttachmentBuilder } = require("discord.js");
const config = require("../config");
const ms = require("ms");
const Discord = require("discord.js");
const userSchema = require("../models/userSchema");
const guildSchema = require("../models/guildSchema");
const { profileImage } = require('discord-arts');

module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction, user) {

        if (interaction.type === Discord.InteractionType.ApplicationCommand) {

            const { exe } = require(`../commands/${interaction.commandName}`);
            exe(client, interaction);
            console.log(`[SLASH] The slash command "${interaction.commandName}" was executed by ${interaction.user.tag}`);
        }

        //Command /profile option
        if (interaction.customId === "option") {
            await interaction.deferReply({ ephemeral: true });

            interaction.followUp({
                fr: {
                    embeds: [{
                        title: `Option`,
                        description: `test`,
                        color: 0x046AFC
                    }],
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: "+4HP (🌼 5 fleurs)",
                                    custom_id: `heal_player`,
                                    style: 2,
                                    disabled: true
                                }
                            ]
                        }
                    ],
                    ephemeral: true
                }
            }[interaction.locale] || {
                embeds: [{
                    title: `Option`,
                    description: `test`,
                    color: 0x046AFC
                }],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "+4HP (🌼 5 fleurs)",
                                custom_id: `heal_player`,
                                style: 2,
                                disabled: false
                            }
                        ]
                    }
                ],
                ephemeral: true
            }
            )
        }
        //----
        //Command /profile stats
        if (interaction.customId === "statistics") {
            await interaction.deferReply({ ephemeral: true });

            const statistics = await userSchema.findOne({
                UserId: interaction.user.id
            })

            interaction.followUp({
                fr: {
                    embeds: [{
                        title: `Statistiques`,
                        description: `**${interaction.user}**\n🌼 \`${statistics.Flowers}\` fleurs\n🔪 \`${statistics.Kills}\` kills\n💀 \`${statistics.Dead}\` morts`,
                        color: 0x046AFC
                    }],
                    ephemeral: true
                }
            }[interaction.locale] || {
                embeds: [{
                    title: `Statistics`,
                    description: `**${interaction.user}**\n🌼 \`${statistics.Flowers}\` flowers\n🔪 \`${statistics.Kills}\` kills\n💀 \`${statistics.Dead}\` dead`,
                    color: 0x046AFC
                }],
                ephemeral: true
            }
            )
        }
        //----
        //Command /profile heal player
        if (interaction.customId === "heal_player") {
            await interaction.deferReply({ ephemeral: true });
            let db = await userSchema.findOne({ UserId: interaction.user.id });
            if (db) {
                const heal_complet = config.emojis.emojiCanvas.heartNormal;
                if (db.Flowers >= 5) {
                    await userSchema.updateOne(
                        {
                            UserId: interaction.user.id
                        },
                        {
                            Flowers: db.Flowers - 5,
                            Heart1: heal_complet,
                            Heart2: heal_complet,
                            Heart3: heal_complet,
                            Heart4: heal_complet
                        });
                }
            }
            interaction.followUp({
                fr: {
                    embeds: [{
                        title: `Statistiques`,
                        description: `**${interaction.user}**`,
                        color: 0x046AFC
                    }],
                    ephemeral: true
                }
            }[interaction.locale] || {
                embeds: [{
                    title: `Statistics`,
                    description: `**${interaction.user}**`,
                    color: 0x046AFC
                }],
                ephemeral: true
            }
            )
        }
        //----
        //Info start giveaway system
        if (interaction.customId === "info-start-giveaway") {
            await interaction.deferReply({ ephemeral: true });
            interaction.followUp({
                fr: {
                    content: `Envoyer un panel dans le salon <#${config.channels.giveawayChannel}> pour pouvoir lancer un giveaway.`,
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: "Envoyer le panneau de lancement du giveaway",
                                    custom_id: `panel-giveaway`,
                                    emoji: "🎉",
                                    style: 2,
                                    disabled: false
                                }
                            ]
                        }
                    ],
                    ephemeral: true
                }
            }[interaction.locale] || {
                content: `Send a panel in the channel <#${config.channels.giveawayChannel}> to be able to launch a giveaway.`,
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Send panel giveaway",
                                custom_id: `panel-giveaway`,
                                emoji: "🎉",
                                style: 2,
                                disabled: false
                            }
                        ]
                    }
                ],
                ephemeral: true
            }
            )
        }
        //----
        //Panel giveaway
        if (interaction.customId === "panel-giveaway") {
            const channel = await client.channels.fetch(config.channels.giveawayChannel);

            let button = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId("start-giveaway-1")
                        .setLabel("Start giveaway")
                        .setEmoji("🐝")
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setDisabled(false)
                )

            const panel = new Discord.EmbedBuilder()
                .setColor(config.colors.default)
                .setTitle("Panel giveaway!")
                .setDescription(`Press the button below to be able to launch a preconfigured giveaway.\n__Information:__\n> Winner: \`1 winner\`\n> Time: \`30 mins\`\n> Price: \`30 flowers\``)
                .setFooter({ text: 'After launching the giveaway, don\'t forget to remove the embed.' })
            channel.send({ embeds: [panel], components: [button] });
        }
        //----
        //Start giveaway system
        if (interaction.customId === "start-giveaway-1") {
            //await interaction.deferReply({ ephemeral: false });

            const duration = `30m`;
            const winners = 1;
            const prize = 30;

            // Calculer le temps restant
            let durationMs = ms(duration);
            let endTime = Date.now() + durationMs;

            const embed = new Discord.EmbedBuilder()
                .setColor(config.colors.default)
                .setTitle(`${prize} flowers`)
                .setDescription(`Click 🎉 to enter!\n__**Duration:**__ **${duration}** (Ends *load*)\nHosted by: <@1056780751133224990>\n\n**Requirements**\n*No Requirements!*`)
                .setFooter({ text: 'The reward and automatically give to the winner!' });

            const message = await interaction.reply({ embeds: [embed], fetchReply: true, content: `🎉 **GIVEAWAY** 🎉` });
            await message.react('🎉');

            const updateInterval = setInterval(() => {
                const timeLeftMs = endTime - Date.now();
                if (timeLeftMs <= 0) {
                    clearInterval(updateInterval);
                    //embed.setDescription(`Le giveaway est terminé !\nGG ! Tu as 24h pour venir en ticket sinon reroll !`);
                    //message.edit({ embeds: [embed] });
                    return;
                }
                embed.setDescription(`Click 🎉 to enter!\n__**Duration:**__ **${duration}** (Ends ${ms(timeLeftMs, { long: true })})\nHosted by: <@1056780751133224990>\n\n**Requirements**\n*No Requirements!*`);
                message.edit({ embeds: [embed], content: `🎉 **GIVEAWAY** 🎉` });
            }, 20000 && 25000)

            setTimeout(async () => {
                const fetchedMessage = await interaction.channel.messages.fetch(message.id);
                const reactions = fetchedMessage.reactions.cache.get('🎉').users.cache.filter((user) => !user.bot);
                if (reactions.size < winners) {
                    const failedEmbed = new Discord.EmbedBuilder()
                        .setColor(config.colors.default)
                        .setTitle(`Giveaway: ${prize}`)
                        .setDescription(`Il n'y a pas assez de participants pour déterminer les winners`)
                        .setFooter({ text: 'The reward and automatically give to the winner!' });

                    return message.edit({ embeds: [failedEmbed] });
                }

                const gagnants = reactions.random(winners);
                const winnersList = gagnants.map((user) => `${user.id}`).join(', ');

                const flowersToAdd = prize;

                let data = await userSchema.findOneAndUpdate(
                    {
                        UserId: winnersList,
                    },
                    {
                        $inc: {
                            Flowers: flowersToAdd,
                        },
                    }
                );

                if (!data) {
                    let data = new userSchema({
                        UserId: winnersList,
                        Flowers: flowersToAdd
                    });
                    data.save();
                }

                const successEmbed = new Discord.EmbedBuilder()
                    .setColor(config.colors.default)
                    .setTitle(`${prize} flowers`)
                    .setDescription(`> Winner: <@${winnersList}>\n*Execute the command \`/profile\` to see your flowers!*`)
                    .setFooter({ text: 'The reward and automatically give to the winner!' });

                return message.edit({ embeds: [successEmbed], content: `||<@${winnersList}>||\n🎉 **GIVEAWAY ENDED** 🎉` });
            }, ms(duration));
        }
        //----

        if (interaction.customId === "viewWasp") {
            await interaction.deferReply({ ephemeral: true });

            const profiles = await userSchema.findOne({
                UserId: interaction.user.id
            });

            const buffer = await profileImage(interaction.user.id, {
                customTag: `${profiles.Flowers} fleur(s).`,
                customBadges: [profiles.Heart4, profiles.Heart3, profiles.Heart2, profiles.Heart1],
                overwriteBadges: true,
                usernameColor: '#d9dfef',
                //borderColor: ['#f90257', '#043a92'],
                squareAvatar: true
            });

            interaction.followUp({
                fr: {
                    embeds: [{
                        title: `Voici ta guêpe !`,
                        description: `Trouve les messages cachés avec la réaction 🌼 et clique dessus pour gagner des fleurs !\n\n**Tu peux ensuite utiliser les fleurs pour :**\n🐝 Soigner ta guêpe avec le bouton ci-dessous !\n🐝 Tant que tu es en vie, tu peux attaquer les autres guêpes avec \`/fight\` !`,
                        image: {
                            url: "attachment://profile.png"
                        },
                        color: 0xFFFF00
                    }],
                    files: [new AttachmentBuilder(buffer, { name: 'profile.png' })],
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    label: "Option Supplémentaire",
                                    custom_id: `option`,
                                    style: 2
                                },
                                {
                                    type: 2,
                                    label: "Statistiques",
                                    custom_id: `statistics`,
                                    style: 1
                                }
                            ]
                        }
                    ]
                }
            }[interaction.locale] || {
                embeds: [{
                    title: `Here is your wasp!`,
                    description: `Find the hidden messages with the reaction 🌼 and click on them to win flowers!\n\n**You can then use the flowers to:**\n🐝 Treat a wasp with the button below!\n🐝 As long as you are alive, you can attack other wasps with \`/fight\`!`,
                    image: {
                        url: "attachment://profile.png"
                    },
                    color: 0xFFFF00
                }],
                files: [new AttachmentBuilder(buffer, { name: 'profile.png' })],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Additional Option",
                                custom_id: `option`,
                                style: 2
                            },
                            {
                                type: 2,
                                label: "Statistics",
                                custom_id: `statistics`,
                                style: 1
                            }
                        ]
                    }
                ]
            }
            )
        }

        if (interaction.customId === "leaderboard") {
            await interaction.deferReply({ ephemeral: true });

            const leaderboard = await userSchema.find({
                UserId: interaction.user.id
            }).sort({ UserEmoji: -1 }).limit(10);

            const mappedData = leaderboard
                .map((d, i) => `\`${i + 1}\` <@${d.UserId}> - Message(s): \`${d.UserMessages}\``)
                .join("\n");

            interaction.followUp({
                fr: {
                    embeds: [{
                        author: { name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `${interaction.user.displayAvatarURL()}` },
                        description: mappedData.toString(),
                        color: 0x046AFC
                    }],
                    ephemeral: true
                }
            }[interaction.locale] || {
                embeds: [{
                    author: { name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `${interaction.user.displayAvatarURL()}` },
                    description: mappedData.toString(),
                    color: 0x046AFC
                }],
                ephemeral: true
            }
            )
        }

        if (interaction.customId === "statsbot") {
            await interaction.deferReply({ ephemeral: true })

            interaction.followUp({
                fr: {
                    embeds: [{
                        author: { name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `${interaction.user.displayAvatarURL()}` },
                        description: `Serveur(s): \`${client.guilds.cache.size}\`\nUtilisateur(s): \`${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\`\nDiscord.js: \`v${Discord.version}\`\nNode: \`${process.version}\``,
                        color: 0x046AFC
                    }],
                    ephemeral: true
                }
            }[interaction.locale] || {
                embeds: [{
                    author: { name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `${interaction.user.displayAvatarURL()}` },
                    description: `Server(s): \`${client.guilds.cache.size}\`\nUser(s): \`${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}\`\nDiscord.js: \`v${Discord.version}\`\nNode: \`${process.version}\``,
                    color: 0x046AFC
                }],
                ephemeral: true
            }
            )
        }








        /*if (interaction.isSelectMenu()) {

            if (interaction.values?.[0] === "emoji1") {

                const emoji1 = "1️⃣"

                let data = await guildSchema.findOneAndUpdate({
                    ReactionEmoji: emoji1,
                    GuildId: interaction.guild.id
                });

                interaction.reply({
                    fr: {
                        embeds: [{
                            author: { name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `${interaction.user.displayAvatarURL()}` },
                            description: `L'émoji ${emoji1} à bien été enregistrer.`,
                            footer: { text: 'Suivix aide votre serveur publicitaire 😁', iconURL: client.user.displayAvatarURL({ dynamic: true }) },
                            color: 0x046AFC
                        }],
                        ephemeral: true
                    }
                }[interaction.locale] || {
                    embeds: [{
                        author: { name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `${interaction.user.displayAvatarURL()}` },
                        description: `The emoji ${emoji1} has been saved.`,
                        footer: { text: 'Suivix helps your ad server 😁', iconURL: client.user.displayAvatarURL({ dynamic: true }) },
                        color: 0x046AFC
                    }],
                    ephemeral: true
                }
                )

                data.save();
            }
            if (interaction.values?.[0] === "emoji2") {
                const emoji2 = "✏️"

                let data = await guildSchema.findOneAndUpdate({
                    ReactionEmoji: emoji2,
                    GuildId: interaction.guild.id
                });

                interaction.reply({
                    fr: {
                        embeds: [{
                            author: { name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `${interaction.user.displayAvatarURL()}` },
                            description: `L'émoji ${emoji2} à bien été enregistrer.`,
                            footer: { text: 'Suivix aide votre serveur publicitaire 😁', iconURL: client.user.displayAvatarURL({ dynamic: true }) },
                            color: 0x046AFC
                        }],
                        ephemeral: true
                    }
                }[interaction.locale] || {
                    embeds: [{
                        author: { name: `${interaction.user.username}#${interaction.user.discriminator}`, iconURL: `${interaction.user.displayAvatarURL()}` },
                        description: `The emoji ${emoji2} has been saved.`,
                        footer: { text: 'Suivix helps your ad server 😁', iconURL: client.user.displayAvatarURL({ dynamic: true }) },
                        color: 0x046AFC
                    }],
                    ephemeral: true
                }
                )

                data.save();
            }
        }*/
    }
};