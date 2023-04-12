const discForums = require("discord-forums");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    async execute(client, reaction, user) {
        // When a reaction is received, check if the structure is partial
        if (reaction.partial) {
            // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Something went wrong when fetching the message:', error);
                // Return as `reaction.message.author` may be undefined/null
                return;
            }
        }

        //Approval Channel Admin Reaction
        if(reaction.message.channel.id == 1095507371624767559 && !user.bot && reaction.message.author != user && reaction.message.author.bot){
            const reactionMessage = reaction.message;
            const embed = reactionMessage.embeds[0];
            if (embed.data.title != "User Application") return;
            const userDiscordId = embed.data.fields[0].value.substring(0, embed.data.fields[0].value.length - 1).substr(1, embed.data.fields[0].value.length - 1).substr(1, embed.data.fields[0].value.length - 1);
            const userMember = await client.guilds.fetch("1094741690620841995").then(async guild => {return await guild.members.cache.get(userDiscordId)});
            const userMcUser = embed.data.fields[1].value;
            const userMcUUID = embed.data.fields[2].value;
            const adminGuild = await client.guilds.fetch("1094741690620841995");
            const forumChannel = await await client.guilds.fetch("1094793211999944764").then(async guild => {return await guild.channels.fetch("1095549468302127247")});
            if(reaction.emoji.name == "✅"){
                userMember.roles.add("1094754485152256030").catch(console.error);
                try {
                    await userMember.setNickname(userMcUser);
                } catch{}
                reactionMessage.channel.send(`User ${userMember.user.username} has been approved.`);
                const newForumPost = await discForums.createPost(forumChannel, `${userMember.user.username} - ${userMcUser}`, `${userMember.user.username} - ${userMcUser}`);
                //User Info Embed
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: "OnyxSMP",
                        url: "https://github.com/OnyxSMP/authentication-bot",
                        iconURL: "https://avatars.githubusercontent.com/u/130323568?s=280&v=4",
                    })
                    .setTitle("User Information")
                    .addFields(
                        {
                            name: "Discord:",
                            value: `<@${userDiscordId}>`,
                        },
                        {
                            name: "Discord ID:",
                            value: `${userDiscordId}`,
                        },
                        {
                        name: "MC Username:",
                        value: userMcUser,
                        },
                        {
                        name: "MC UUID:",
                        value: userMcUUID,
                        },
                    )
                    .setColor("#ff0048");
                    const message = await newForumPost.send({ embeds: [embed] });
                    reactionMessage.delete();
            }
            else if(reaction.emoji.name == "❌"){
                reactionMessage.channel.send(`User ${userMember.user.username} has been denied.`);
                try{
                    await userMember.send(`<@${userDiscordId}> your whitelist application has been denied. Please try again or contact an admin.`);
                }
                catch (error){
                    client.guilds.fetch("1094741690620841995").then(guild => guild.channels.fetch("1094752253098872943").then(channel => channel.send(`<@${userDiscordId}> you have been denied. Please try again or contact an admin.`)));
                }
                reactionMessage.delete();
            }
        }
    },
};