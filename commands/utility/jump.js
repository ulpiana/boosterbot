// const {
//   SlashCommandBuilder,
//   EmbedBuilder,
//   Client,
//   GatewayIntentBits,
//   Events,
//   ButtonBuilder,
//   ButtonStyle,
//   ActionRowBuilder,
// } = require("discord.js");
// const client = new Client({ intents: [GatewayIntentBits.Guilds] });
// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("jump")
//     .setDescription("You and others can mute another user for up to 60 seconds")
//     .addMentionableOption((option) =>
//       option
//         .setName("user")
//         .setDescription("The user you wish to mute")
//         .setRequired(true)
//     ),
//   async execute(interaction) {
//     const targetUser = interaction.options.getMember("user");
//     const user = interaction.user;

//     if (!targetUser) {
//       return interaction.reply({
//         content: "Please mention a user to jump!",
//         ephemeral: true,
//       });
//     }

//     const initialEmbed = new EmbedBuilder()
//       .setColor("#f47fff")
//       .setAuthor({ name: "JUMP THIS MF 🗣️🗣️🗣️🗣️" })
//       .setDescription(
//         `${user} is jumping ${targetUser.user}! You have 30 seconds to join in!`
//       )
//       .setTimestamp();

//     const button = new ButtonBuilder()
//       .setCustomId("jump_btn")
//       .setLabel("Jump")
//       .setStyle(ButtonStyle.Primary);

//     const row = new ActionRowBuilder().addComponents(button);
//     const message = await interaction.reply({
//       embeds: [initialEmbed],
//       components: [row],
//       fetchReply: true,
//     });
//     const filter = (i) =>
//       i.customId === "jump_btn" &&
//       i.user.id !== targetUser.id &&
//       i.user.id !== user.id;
//     const collector = message.createMessageComponentCollector({
//       filter,
//       time: 30_000,
//     });

//     let participants = [];

//     collector.on("collect", async (i) => {
//       participants.push(i.user);
//       i.reply({ content: `Joined!`, ephemeral: true });
//     });

//     collector.on("end", async (collected) => {
//       try {
//         const currentTime = Date.now();
//         const timeout = Math.min(15 * participants.length, 60);
//         const totalTimeout = (currentTime + timeout) * 1000;
//         const participantsList = participants.map((p) => p.globalName).join(", ") || "no one";

//         targetUser.timeout(
//           totalTimeout,
//           `Jumped by ${participants.length} users.`
//         );

//         const finalTimeout = Math.max(timeout, 15); // Ensure at least 15 seconds

//         const jumpedEmbed = new EmbedBuilder().setColor("#f47fff")
//           .setDescription(`${user} just jumped ${targetUser.user} and ${participantsList} joined in!
// 		 \n \n ${targetUser.user} has been muted for ${finalTimeout} seconds.`);
//         interaction.followUp({ embeds: [jumpedEmbed], components: [] });
//         targetUser.timeout(
//           totalTimeout,
//           `Jumped by ${participants.length} users.`
//         );
//       } catch (error) {
// 		console.error(error);
// 		await interaction.reply({
// 		  content: "Failed to execute. If this keeps happening, ping PULP.",
// 		  ephemeral: true,
// 		});
// 	  }
//     });
//   },
// };
