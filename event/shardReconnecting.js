const { WebhookClient } = require("discord.js");
const config = require("../config");

module.exports = {
    name: 'shardReconnecting',
    once: true,
    async execute() {
        new WebhookClient(config.webhooks.shard).send({
            embeds: [{
                color: 0x046AFC,
                description: (`${config.emojis.shardReconnecting} Shard \`#0\` reconnect... (<t:${Math.floor(Date.now() / 1000)}:R>)`)
            }]
        })
    }
};