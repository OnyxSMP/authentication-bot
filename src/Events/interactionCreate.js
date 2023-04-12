module.exports = {
  async execute(client, interaction) {
    const { commandName } = interaction;
    const command = client.commands.get(commandName);

    if (!command) return;

    try {
      command.execute(interaction, client);
    } catch (err) {
      console.log(err);
    }
  },
};
