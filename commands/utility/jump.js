// const {
//     SlashCommandBuilder,
//     EmbedBuilder, Client, GatewayIntentBits, Events, ButtonBuilder,
// 	ButtonStyle, ActionRowBuilder
//   } = require("discord.js");
//   const client = new Client({ intents: [GatewayIntentBits.Guilds] });
//   module.exports = {
// 	data: new SlashCommandBuilder()
// 	.setName('jump')
// 	.setDescription('You and others can mute another user for up to 60 seconds')
// 	.addMentionableOption((option) =>
// 		option
// 		  .setName("user")
// 		  .setDescription("The user you wish to mute")
// 		  .setRequired(true)
// 	  ),
// 	async execute(interaction) {
// 		const targetUser = interaction.options.getMember("user");
// 		const user = interaction.user;

// 		if (!targetUser) {
//             return interaction.reply({ content: 'Please mention a user to jump!', ephemeral: true });
//         }

// 		const initialEmbed = new EmbedBuilder()
// 		.setColor("#f47fff")
// 		.setAuthor({ name: "JUMP THIS MF 🗣️🗣️🗣️🗣️" })
// 		.setTitle(`${user} is jumping ${targetUser.user}! You have 30 seconds to join in!`)
// 		.setDescription("test")
// 		.setTimestamp()
		
// 		const button = new ButtonBuilder()
// 			.setCustomId('jump_btn')
// 			.setLabel('Jump')
// 			.setStyle(ButtonStyle.Primary)

// 		const row = new ActionRowBuilder().addComponents(button);

// 		const message = await interaction.reply({ embeds: [initialEmbed], components: [row], fetchReply: true})

// 		const filter = i => i.customId === 'jump_btn' && i.user.id !== targetUser.id;
// 		const collector = message.createMessageComponentCollector({filter, time: 30_000})

// 		let participants = [];
// 		let totalTimeout = 15; 

// 		collector.on('collect', i => {
// 			participants.push(i.user);
// 			i.reply({ content: `You've joined the jump!`, ephemeral: true });
// 			const totalTimeout = Math.min(15 * participants.length, 60); 
// 			targetUser.timeout(totalTimeout * 1000, `Jumped by ${participants.length} users.`);
// 		})

// 		collector.on('end', collected => {
// 			const participantsList = participants.map(p => p.username).join(', ') || 'no one';
// 			 const finalTimeout = Math.max(totalTimeout, 15); // Ensure at least 15 seconds
			
// 			const jumpedEmbed = new EmbedBuilder()
// 				.setColor("#f47fff")
// 				.setTitle(`${user.user} just jumped ${targetUser.user} and ${participantsList} joined in!`)
// 				.setDescription(`${targetUser.user} has been muted for ${totalTimeout} seconds.`)
// 			interaction.followUp({ embeds: [jumpedEmbed], components: [] });
// 			targetUser.timeout(finalTimeout * 1000, `Jumped by ${participants.length} users.`);
// 		})
// 	},
// }