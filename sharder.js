const { ShardingManager } = require("discord.js");

const manager = new ShardingManager("./index.js", {
    totalShards: "auto",
    token: require("./config").bot.token
});
console.log(String.raw`

___       __  __  __          _____              
/ _ )___ _/ /_/ /_/ /__ ___   / ___/__ ___ _  ___ 
/ _  / _ '/ __/ __/ / -_|_-<  / |_ / _ '/  ' \/ -_)
/____/\_,_/\__/\__/_/\__/___/  \___/\_,_/_/_/_/\__/ 
                                                  

`)

manager.spawn();