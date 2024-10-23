const {
    SlashCommandBuilder,
    EmbedBuilder, Client, GatewayIntentBits, Events
  } = require("discord.js");
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  module.exports = {
	data: new SlashCommandBuilder()
		.setName('jump')
		.setDescription('Mute another user for up to 90 seconds'),
	async execute(interaction) {
		await interaction.reply({content: 'shh this is a WIP 🚧',
			ephemeral: true});
	},
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});