const config = require("../config");

module.exports = {
    data: {
        description: "Vote for the bot and win flowers.",
        descriptionLocalizations: {
            fr: "Votez pour le bot et gagnez des fleurs."
        }
    },

    async exe(client, interaction) {
        interaction.reply({
            fr: {
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: "Votez pour le bot et gagnez 25 🌼 !",
                                url: config.topgg,
                                emoji: "🐝",
                                style: 5
                            }
                        ]
                    }
                ]
            }
        }[interaction.locale] || {
            components: [
                {
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Vote for the bot and win 25 🌼 !",
                            url: config.topgg,
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