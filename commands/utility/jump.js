const {
  SlashCommandBuilder,
  EmbedBuilder,
  Client,
  GatewayIntentBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
new Client({ intents: [GatewayIntentBits.Guilds] });
const fs = require("node:fs");

module.exports = {
  cooldown: 500,
  data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription("You and others can mute another user for up to 60 seconds")
    .addMentionableOption((option) =>
      option
        .setName("user")
        .setDescription("The user you wish to mute")
        .setRequired(true)
    ),

  async execute(interaction) {
    fs.readFile("jumpGifs.json", "utf8", (err, data) => {
      if (err) {
        console.error("Could not read file:", err);
        return;
      }
      jumpGifs = JSON.parse(data);
    });

    const targetUser = interaction.options.getMember("user");
    const user = interaction.user;


    if (!interaction.isCommand()) return;

    if (!targetUser) {
      await interaction.reply({
        content: "That user does not exist here",
        ephemeral: true,
      });
      return;
    }

    if (interaction.user === targetUser.user) {
      await interaction.reply({
        content: "You cannot mute yourself",
        ephemeral: true,
      });
      return;
    }

    if (targetUser.user.bot) {
      await interaction.reply({
        content: "You can't mute me >:( I mute YOU!",
        ephemeral: true,
      });
      return;
    }

    if (
      !interaction.member.roles.cache.some((role) => role.name === "Booster")
    ) {
      await interaction.reply({
        content: "This command is for server boosters only!",
        ephemeral: true,
      });
      return;
    }

    if (targetUser.roles.cache.some((role) => role.name === "Administrator") || targetUser.roles.cache.some((role) => role.name === "Moderator")) {
      await interaction.reply({
        content: "You really thought you could out-mod a mod",
        ephemeral: true,
      });
      return;
    }


    const initialEmbed = new EmbedBuilder()
      .setColor("#9bd5ea")
      .setAuthor({ name: "JUMP THIS MF 🗣️🗣️🗣️🗣️" })
      .setDescription(
        `${user} is jumping ${targetUser.user}! You have 20 seconds to join in!`
      )
      .setImage("https://i.pinimg.com/736x/ea/a2/b1/eaa2b14dbe498b7d3c674a56cb4db829.jpg")
      .setTimestamp();

    const button = new ButtonBuilder()
      .setCustomId("jump_btn")
      .setLabel("Jump")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);
    const message = await interaction.reply({
      embeds: [initialEmbed],
      components: [row],
      fetchReply: true,
    });

    const filter = (i) =>
      i.customId === "jump_btn" &&
      i.user.id !== targetUser.id &&
      i.user.id !== user.id;

    const collector = message.createMessageComponentCollector({
      filter,
      time: 20_000,
    });

    let participants = [];

    if (jumpGifs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * jumpGifs.length);
    const media = jumpGifs[randomIndex];

    collector.on("collect", async (i) => {
      
      if (i.user.id == interaction.user.id) {
        row.components[0].setDisabled(true);
      }

      if (!participants.includes(i.user)) {
        participants.push(i.user);        
        i.reply({ content: `Joined!`, ephemeral: true });
      }
    });

    collector.on("end", async () => {
      try {
        if (!participants.includes(user)) {
          participants.push(user);
        }

        let timeout = Math.min(15_000 * participants.length, 60_000);

        const filteredParticipants = participants.filter(
          (p) => p.id !== user.id
        );
        let participantsList =
          filteredParticipants.map((p) => p.toString()).join(", ") || "no one";


        targetUser.timeout(timeout, `Jumped by ${participants.length} users.`);

        const jumpedEmbed = new EmbedBuilder()
          .setColor("#9bd5ea")
          .setDescription(
            `${user} just jumped ${
              targetUser.user
            } and ${participantsList} joined in!
		 \n \n ${targetUser.user} has been muted for ${timeout / 1000} seconds.`
          )
          .setImage(media.gif)
          .setFooter({
            text: "Boost the NIGHTVIBES server to gain access to exclusive commands and roles!",
            iconURL: "https://cdn3.emoji.gg/emojis/2086-nitro-boost-spin.gif"
          });
        await interaction.followUp({ embeds: [jumpedEmbed], components: [] });
      } catch (error) {
        console.error(error);
        await interaction.followUp({
          content: "Failed to execute. If this keeps happening, ping PULP.",
          ephemeral: true,
        });
      }
    });
  },
};