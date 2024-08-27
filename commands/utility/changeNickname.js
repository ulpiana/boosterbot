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
        "https://cdn.discordapp.com/attachments/1138596262673916008/1277135767604432966/trim.09D1D7D4-7A4F-473A-AD7C-B18D41F04399.gif?ex=66cc10df&is=66cabf5f&hm=3788655f9af293e22c8471b80e51308e2de4f2d55b79a37276e84582b625064f&"
      )
      .setTimestamp()
      .setFooter({text: 'Boost the server to gain access to exclusive commands and roles!'});

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
      !interaction.member.roles.cache.some(
        (role) => role.name === "Booster"
      )
    ) {
      await interaction.reply({
        content: "This command is for server boosters only!",
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
