const config = require("../config");

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
    }
}