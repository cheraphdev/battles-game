const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { readdirSync } = require("fs");
const config = require("./config");
const express = require('express');
const { port } = require('./config/app.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  restTimeOffset: 0,
  partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
})

client.commands = new Collection()

const app = express();

app.get('/', (request, response) => {
	return response.sendFile('./app/index.html', { root: '.' });
});

app.listen(port, () => console.log(`[APP] Runing: http://votredomaine:${config.app.port}`));

client.login(config.bot.token)

const eventFiles = readdirSync("./event").filter((file) => file.endsWith(".js"))
for (const file of eventFiles) {
  const event = require(`./event/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args))
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args))
  }
}

process.on("unhandledRejection", (error) => {
  if (error.code == 10062) return; // Unknown interaction
  console.log(`[ERREUR] ${error}`);
})