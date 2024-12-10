require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
  MessageCollector
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  allowedMentions: { parse: ["users"] },
});

client.commands = new Collection();
client.cooldowns = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
const PREFIX = ".";

// Get files from commands / utils
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

let trivia = null;

// Load trivia questions from the JSON file
fs.readFile("atTrivia.json", "utf8", (err, data) => {
  if (err) {
    console.error("Could not read trivia.json:", err);
    return;
  }
  triviaQuestions = JSON.parse(data);
});

function sendTriviaQuestion(message) {
  const channel = client.channels.cache.get("945713353186234378"); // currently: nv general

  if (!channel) {
    console.error("Channel not found!");
    return;
  }

  setInterval(() => {
    if (triviaQuestions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
    const trivia = triviaQuestions[randomIndex];
    
    const embed = new EmbedBuilder()
      .setAuthor({ name: "GOOD LUCK" })
      .setColor("#f47fff")
      .setDescription(trivia.question)
      .addFields({ name: 'Difficulty level: ', value: trivia.level, inline: true })
      .setImage(trivia.image)
      .setTimestamp()
      .setFooter({
        text: "Boost the NIGHTVIBES server to gain access to exclusive commands and roles!",
        iconURL: "https://cdn3.emoji.gg/emojis/2086-nitro-boost-spin.gif",
      });

      const answerEmbed = new EmbedBuilder()
      .setColor("#59a694")
      .setTimestamp()
      .setFooter({
        text: "Thanks for answering!",
      });

    
      const collectorFilter = response => {
        return trivia.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
      };


    channel.send({ embeds: [embed], fetchReply: true })
    .then(sentMessage => {
      channel.awaitMessages({ filter: collectorFilter, max: 1, time: 1_200_000, errors: ['time'] })
      .then(collected => {
        sentMessage.edit({
          embeds: [answerEmbed.setDescription(`${collected.first().author} got the correct answer! 🎉`)]
        });
      })
      .catch(() => {
        sentMessage.edit({
          embeds: [answerEmbed.setDescription("Time's up! No one got the correct answer.").setFooter({text: "Try again next time :/"}).setColor("#ba1e36")],
        });
      })
    
    })
  }, 25_200_000 ); //  7 hrs

}

// Bot's online
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  sendTriviaQuestion();
});

// Get registered commands
client.on(Events.InteractionCreate, async (interaction, message) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  // Cooldown logics
  const { cooldowns } = interaction.client;

  if (!cooldowns.has(command.data.name)) {
    cooldowns.set(command.data.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const defaultCooldownDuration = 3;
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1_000);
      return interaction.reply({
        content: `You're now in the chillzone. Try using / \`${command.data.name}\` <t:${expiredTimestamp}:R>.`,
        ephemeral: true,
      });
    }
  }
  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      // await interaction.deferReply();
      // await wait(4_000);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.BOT_TOKEN);
