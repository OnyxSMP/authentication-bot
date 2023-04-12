const { REST, Routes } = require("discord.js");

module.exports = {
  async execute(client) {
    const { TOKEN, GUILD_ID, BOT_ID } = client.config;
    const rest = new REST({ version: "10" }).setToken(TOKEN);

    const commands = [];
    client.commands.forEach((value, key, map) => {
      var command = client.commands.get(key);
      commands.push(command.data);
    });

    (async () => {
      try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
    
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
          Routes.applicationCommands(BOT_ID),
          { body: commands },
        );
    
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
      } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
      }
    })();
  },
};
