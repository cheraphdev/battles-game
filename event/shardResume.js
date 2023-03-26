const { WebhookClient } = require("discord.js");
const config = require("../config");

module.exports = {
    name: 'shardResume',
    once: true,
    async execute() {
        new WebhookClient(config.webhooks.shard).send({
            embeds: [{
                color: 0x046AFC,
                description: (`${config.emojis.shardResume} Shard \`#0\` reconnected! (<t:${Math.floor(Date.now() / 1000)}:R>)`)
            }]
        })
    }
};