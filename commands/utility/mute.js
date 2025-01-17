const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");

module.exports = {
  cooldown: 500,
  data: new SlashCommandBuilder()
    .setName("fall")
    .setDescription("Mute another member for 30 seconds.")
    .addMentionableOption((option) =>
      option
        .setName("user")
        .setDescription("The user you wish to mute")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription(
          `Write a custom message for the user, if it doesn't follow rules, you'll be banned.`
        )
        .setRequired(false)
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getMember("user");
    const customMessage = interaction.options.getString("message");
    const fixedMessage = `${interaction.user} muted ${targetUser} for 30 seconds`;
    const embedMessage = customMessage
      ? `${fixedMessage} \n \n "${customMessage}"`
      : fixedMessage;
    const embed = new EmbedBuilder()
      .setColor("9bd5ea")
      .setDescription(`${embedMessage}`)
      .setImage(
        "https://media1.tenor.com/m/bT-kVojT-X0AAAAC/adventure-time-fall.gif"
      )
      .setTimestamp()
      .setFooter({
        text: "Boost the NIGHTVIBES server to gain access to exclusive commands and roles!",
        iconURL: "https://cdn3.emoji.gg/emojis/2086-nitro-boost-spin.gif"
      });

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

    try {
      const timeoutDuration = 30 * 1000;
      await targetUser.timeout(timeoutDuration, embedMessage);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Failed to execute. If this keeps happening, ping PULP.",
        ephemeral: true,
      });
    }
  },
};
