const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  cooldown: 60,
  data: new SlashCommandBuilder()
    .setName("transfigure")
    .setDescription("Change another user's nickname")
    .addMentionableOption((option) =>
      option
        .setName("user")
        .setDescription("The user who's name you wish to change")
        .setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("Choose the following names:")
        .setRequired(true)
        .addChoices(
          { name: "MathematicalUser", value: "MathematicalUser" },
          { name: "iShouldBeBanned", value: "iShouldBeBanned" },
          { name: "Mods, ban me pls", value: "Mods, ban me pls" },
          { name: "What The Lump?", value: "What The Lump?" },
          { name: "AverageDiscordUser", value: "AverageDiscordUser" },
          { name: "NumberOneBooster", value: "NumberOneBooster" },
          { name: "BoostNightVibes", value: "BoostNightVibes" },
          { name: "ImTotallyBuns", value: "ImTotallyBuns" },
          {
            name: "CoolestAdventureTimeServerFr",
            value: "CoolestAdventureTimeServerFr",
          }
        )
    ),

  async execute(interaction) {
    const targetUser = interaction.options.getMember("user");
    const nickname = interaction.options.getString("nickname");
    const newEmbed = new EmbedBuilder()
      .setColor("#f47fff")
      .setDescription(
        `${interaction.user} just turned ${targetUser} into ${nickname}`
      )
      .setImage(
        "https://cdn.discordapp.com/attachments/1121934957154160792/1277813099428315189/trim.09D1D7D4-7A4F-473A-AD7C-B18D41F04399.gif?ex=66ce87af&is=66cd362f&hm=535362d17642cb01f02188127809c3b403eb3c2c7b2d8185e5287ab95a5db919&"
      )
      .setTimestamp()
      .setFooter({
        text: "Boost the NIGHTVIBES server to gain access to exclusive commands and roles!",
        iconURL: "https://cdn3.emoji.gg/emojis/2086-nitro-boost-spin.gif",
      });

    if (!interaction.isCommand()) return;

    if (!targetUser) {
      await interaction.reply({
        content: "That user does not exist here",
        ephemeral: true,
      });
      return;
    }

    if (targetUser.user.bot) {
      await interaction.reply({
        content: "Hey, leave the bots out of this",
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

    if (
      targetUser.roles.cache.some((role) => role.name === "Administrator") ||
      targetUser.roles.cache.some((role) => role.name === "Moderator")
    ) {
      await interaction.reply({
        content: "You really thought you could out-mod a mod",
        ephemeral: true,
      });
      return;
    }

    try {
      await targetUser.setNickname(nickname);
      // await interaction.deferReply()
      // await wait(4_000);
      await interaction.reply({ embeds: [newEmbed] });
    } catch (error) {
      console.error(error);
      // await interaction.deferReply();
      // await wait(4_000);
      await interaction.reply(
        "Failed to execute. If this keeps happening, ping PULP."
      );
    }
  },
};
