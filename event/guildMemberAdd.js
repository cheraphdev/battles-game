const config = require("../config");
const supportSchema = require("../models/supportSchema");
const userSchema = require("../models/userSchema");

module.exports = {
    name: 'guildMemberAdd',
    async execute(client, member) {
        if (member.guild.id != config.guildid) return;
        let myRole = member.guild.roles.cache.get(config.roles.memberRole);
        member.roles.add(myRole);
        const channelid = config.channels.welcomeChannel;
        const message2 = `Hi <@${member.id}>, welcome to the support server of <@${client.user.id}> 🌻`
        const channel = member.guild.channels.cache.get(channelid)
        channel.send(message2)

        let db = await supportSchema.findOne({ SupportId: config.guildid });
        if (db) {
            if (db.UserId.includes(member.id)) {
                return console.log(`[LOGS] ${member.tag} à déjà rejoint le serveur support.`)
            }
            db.UserId.push(member.id);
            await db.save();

            const flowersToAdd = config.economy.joinSupport;

            let data = await userSchema.findOneAndUpdate(
                {
                    UserId: member.id,
                },
                {
                    $inc: {
                        Flowers: flowersToAdd,
                    },
                }
            );

            if (!data) {
                let data = new userSchema({
                    UserId: member.id,
                    Flowers: flowersToAdd
                });
                data.save();
            }

            console.log(`[LOGS] ${config.economy.joinSupport} fleur à été donner à ${member.tag} car il à rejoins le serveur support.`);
        }
    }
}