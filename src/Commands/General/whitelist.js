const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: {
    name: "whitelist",
    description: "Get whitelisted here.",
    dm_permissions: "0",
    options: [
      {
        name: "mc-username",
        description: "Minecraft Java Username",
        type: 3,
        required: true,
      },
    ],
  },
  async execute(interaction, client) {
    if (interaction.channel.id !== "1094752253098872943") return await interaction.reply({content: "Whitelisting only works in the whitelisting channel.", ephemeral: true});
    const user = interaction.user;
    const proposedUsername = interaction.options._hoistedOptions[0].value;
    const mojangApiResponse = await fetch(`https://api.ashcon.app/mojang/v2/user/${proposedUsername}`);
    const mojangApiResponseJson = await mojangApiResponse.json();
    //Username Check
    if(mojangApiResponseJson.error){
        //Bad Username
        if(mojangApiResponseJson.code == 400 || mojangApiResponseJson.code == 404){
            try {
                const embed = new EmbedBuilder()
                .setAuthor({
                    name: "OnyxSMP",
                    url: "https://github.com/OnyxSMP/authentication-bot",
                    iconURL: "https://avatars.githubusercontent.com/u/130323568?s=280&v=4",
                })
                .setTitle("Error")
                .setDescription("*There seems to be an issue with your username.*\n**Please make sure it is a valid Minecraft Java Edition username.**")
                .addFields(
                    {
                    name: "Error Specifics:",
                    value: `\`\`\`${JSON.stringify(mojangApiResponseJson.code)} - ${JSON.stringify(mojangApiResponseJson.reason)}\`\`\``,
                    },
                )
                .setColor("#ff0048");
                await interaction.reply({ embeds: [embed], ephemeral: true});
            } catch (error) {
                await interaction.reply({ content: "Silly little goose.", ephemeral: true});
            }
        }
        //Unexpected API Response
        else{
            await interaction.channel.send("<@525857847507156992> The Bot Is Broken LMFAO");
            await interaction.reply({content:"Error. Something went wrong on our end. Please ping an Admin.", ephemeral: true});
        }
    }
    //Api Is Down
    else if (!mojangApiResponse.ok){
        await interaction.channel.send("<@525857847507156992> The Api Is Down LMFAO");
        await interaction.reply({content:"Error. Something went wrong on our end. Please ping an Admin.", ephemeral: true});
    }
    //Good Username
    else{
        const accountUsername = mojangApiResponseJson.username ? mojangApiResponseJson.username : "N/A";
        const accountUUID = mojangApiResponseJson.uuid ? mojangApiResponseJson.uuid : "N/A";
        const accountCreatedAt = mojangApiResponseJson.created_at ? mojangApiResponseJson.created_at : "N/A";

        const embed = new EmbedBuilder()
        .setAuthor({
            name: "OnyxSMP",
            url: "https://github.com/OnyxSMP/authentication-bot",
            iconURL: "https://avatars.githubusercontent.com/u/130323568?s=280&v=4",
        })
        .setTitle("Is This You?")
        .addFields(
            {
            name: "MC Username:",
            value: accountUsername,
            },
            {
            name: "MC UUID (Unimportant):",
            value: accountUUID,
            },
            {
            name: "MC Account Creation Date:",
            value: accountCreatedAt,
            },
        )
        .setColor("#ff0048");
        const message = await interaction.reply({
            embeds: [embed],
            ephemeral: true,
            components: [
                new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                        .setCustomId("yesMyAccount")
                        .setLabel("Yes")
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId("noMyAccount")
                        .setLabel("No")
                        .setStyle(ButtonStyle.Danger)
                ),
            ],
        });
    }

    //Button Response
    const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });
    collector.on('collect', async i => {
        try {
            await i.deferUpdate();
        } catch (error) {
            console.log(error);
        }
        const accountUsername = mojangApiResponseJson.username ? mojangApiResponseJson.username : "N/A";
        const accountUUID = mojangApiResponseJson.uuid ? mojangApiResponseJson.uuid : "N/A";
        const accountCreatedAt = mojangApiResponseJson.created_at ? mojangApiResponseJson.created_at : "N/A";
        //Check or something
        try {
            if(i.member.id != interaction.user.id) {return i.reply({ content: `This interaction is not for you`, ephemeral: true})}
        } catch (error) {
            console.log(error);
        }
        //Yes Button
        if(i.customId == 'yesMyAccount') {
            //Send Application To Admin
            const embed = new EmbedBuilder()
            .setAuthor({
                name: "OnyxSMP",
                url: "https://github.com/OnyxSMP/authentication-bot",
                iconURL: "https://github.com/OnyxSMP/wiki.onyxsmp.net/blob/main/logo.png?raw=true",
            })
            .setTitle("User Application")
            .addFields(
                {
                name: "Discord:",
                value: `<@${interaction.user.id}>`,
                },
                {
                name: "Minecraft Username:",
                value: accountUsername,
                },
                {
                name: "Minecraft UUID:",
                value: accountUUID,
                },
            )
            .setColor("#ff0048");
            client.guilds.fetch("1094741690620841995").then(guild => guild.channels.fetch("1095507371624767559").then(channel => channel.send({ embeds: [embed] }).then(message =>{
                message.react('✅').then(() => message.react('❌'));
            })));
            await interaction.followUp({ content: "Whitelist application has been sent to admins for approval, you'll get pinged and added as soon as it's approved.", ephemeral: true });
        }
        //No Button
        if(i.customId == 'noMyAccount') {
            await interaction.followUp({ content: "Try again or ping Admin if you need help.", ephemeral: true });
        }
    });
  },
};