const config = require("../config");

module.exports = {
    data: {
        description: "Manage the bot settings.",
        descriptionLocalizations: {
            fr: "Gérez les paramètres du bot.."
        }
    },

    async exe(client, interaction) {
        if (!interaction.member.permissions.has("Administrator")) {
            interaction.reply({
                fr: {
                    content: `Vous n'avez pas l'autorisation (administrateur) d'utiliser cette commande. Veuillez demander à un administrateur d'utiliser la commande \`/manage\`.`,
                    ephemeral: true
                }
            }[interaction.locale] || {
                content: `You don't have the permission (Administrator) to use this command. Please ask an administrator to use the \`/manage\` command.`,
                ephemeral: true
            }
            )
        }

        interaction.reply({
            fr: {
                embeds: [{
                    title: `Paramètres du bot`,
                    description: `Actuellement, il est uniquement possible d'activer ou de désactiver la saison. D'autres paramètres seront bientôt ajoutés, alors n'hésitez pas à rejoindre le serveur support pour rester informé !`,
                    color: 0xFFFF00
                }],
                ephemeral: true,
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Activate the season",
                                custom_id: `option`,
                                emoji: "🐝",
                                disabled: true,
                                style: 1
                            },
                            {
                                type: 2,
                                label: "Rejoignez le serveur support",
                                url: config.support,
                                emoji: "🌼",
                                style: 5
                            }
                        ]
                    }
                ]
            }
        }[interaction.locale] || {
            embeds: [{
                title: `Bot settings`,
                description: `Currently it is only possible to activate or deactivate the season. More settings will be added soon, so don't hesitate to join the support server to stay informed!`,
                color: 0xFFFF00
            }],
            ephemeral: true,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Activate the season",
                            custom_id: `option`,
                            emoji: "🐝",
                            disabled: true,
                            style: 1
                        },
                        {
                            type: 2,
                            label: "Join the support server",
                            url: config.support,
                            emoji: "🌼",
                            style: 5
                        }
                    ]
                }
            ]
        }
        )
    }
}