const config = require("../config");

module.exports = {
    data: {
        description: "Display the support invitation link.",
        descriptionLocalizations: {
            fr: "Affichez le lien d'invitation du support."
        }
    },

    async exe(client, interaction) {
        interaction.reply({
            fr: {
                content: config.support,
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Rejoignez le serveur communautaire pour 25 🌼",
                                url: config.support,
                                emoji: "🐝",
                                style: 5
                            }
                        ]
                    }
                ]
            }
        }[interaction.locale] || {
            content: config.support,
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Join the community server for 25 🌼",
                            url: config.support,
                            emoji: "🐝",
                            style: 5
                        }
                    ]
                }
            ]
        }
        )
    }
}