require("dotenv").config();

const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");
const client = new Client({
  partials: ["GUILD_MEMBER"],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

const config = require("./config.json");
const PREFIX = ".";
const BOOSTER_ROLE_ID = "1174192479239688244"; 

client.on("ready", () => {
  console.log(`Bot is online, ${client.user.tag}!`);
});

client.on("guildMemberUpdate", async (oldMember, newMember) => {
  const boosterExclusiveChannel = client.channels.cache.get(
    config.boosterExclusiveChannelId
  );

  if (!oldMember.premiumSince && newMember.premiumSince) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: "BOOSTED!",
        iconURL: "https://cdn3.emoji.gg/emojis/21025-boosterbadge-rolling.gif",
      })
      .setDescription(
        `>>> Thanks for the boost <\:catfuckyou:1168638350819852418>, ${message.author} \n Check out this channel made just for you: ${boosterExclusiveChannel}`
      )
      .setColor("#F47FFF")
      .setThumbnail(
        `${message.author.displayAvatarURL({ format: "png", dynamic: true })}`
      )
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (!message.guild || message.author.bot) return;

  if (message.content.startsWith(`${PREFIX}fall`)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const member = message.mentions.members.first();
    const customMessage = args.slice(2).join(" ");
    const fixedMessage = `${message.author} muted ${member.user} for 30 seconds`;
    const embedMessage = customMessage ? `${fixedMessage}: ${customMessage}` :fixedMessage;
    
    if (!member) {
      return message.reply("Please mention a member to mute.");
    }
    if (!message.member.roles.cache.has(BOOSTER_ROLE_ID)) {
      return message.reply("You do not have permission to use this command.");
    }
    if (!member.moderatable) {
      return message.reply("I cannot mute this user.");
    }

    if (!message.guild.members.cache.has(member.id)) {
      return message.reply("User is not in this server.");
    }
    try {
      await member.timeout(30000, 'Muted by booster command');
      const newEmbed = new EmbedBuilder()
        .setColor("#1b1b1c")
        .setDescription( `${embedMessage}`)
        .setImage(
          "https://media1.tenor.com/m/bT-kVojT-X0AAAAC/adventure-time-fall.gif"
        )
        .setTimestamp();
      message.channel.send({ embeds: [newEmbed] });
    } catch (error) {
      console.error("Error muting member:", error);
      message.reply("There was an error trying to mute the member.");
    }
  }
});

client.login(process.env.BOT_TOKEN);
