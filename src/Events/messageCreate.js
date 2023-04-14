module.exports = {
    async execute(client, message) {
        if(message.channel.id == "1094752253098872943" && !message.author.bot && !message.member.roles.cache.has("1094749656933744751")){
            try {
                await message.reply("If you need help, please use <#1094756393745129532>.").then(msg => {
                    setTimeout(() =>{
                        msg.delete();
                        message.delete();
                    }, 3000)
                })
            } catch{}
        }
    },
};