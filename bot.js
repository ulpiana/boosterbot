require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActivityType
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

// Load trivia questions from the JSON file
fs.readFile("atTrivia.json", "utf8", (err, data) => {
  if (err) {
    console.error("Could not read trivia.json:", err);
    return;
  }
  triviaQuestions = JSON.parse(data);
});

// function to shuffle the options
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

async function sendTriviaQuestion() {
  const channel = client.channels.cache.get("945713322051924028"); // currently: NV general

  if (triviaQuestions.length === 0) return;
  const randomIndex = Math.floor(Math.random() * triviaQuestions.length);
  const trivia = triviaQuestions[randomIndex];

  const questionEmbed = new EmbedBuilder()
  .setAuthor({ name: "GOOD LUCK" })
  .setColor("#ffba1e")
  .setDescription(trivia.question)
  .setImage(trivia.image)
  .setTimestamp()
  .setFooter({
    text: "Boost the NIGHTVIBES server to gain access to exclusive commands and roles!",
    iconURL: "https://cdn3.emoji.gg/emojis/2086-nitro-boost-spin.gif",
  });

  let answered = false; 

  const options = [
    { label: trivia.option1, value: "option1" },
    { label: trivia.option2, value: "option2" },
    { label: trivia.option3, value: "option3" },
  ];

  shuffleArray(options);

  const row = new ActionRowBuilder().addComponents(
    options.map((option) =>
      new ButtonBuilder()
        .setCustomId(option.value)
        .setLabel(option.label)
        .setStyle(ButtonStyle.Primary)
    )
  );

  const correctOption = trivia.correctAnswer;
  const correctAnswer = options.find(
    (option) => option.label === correctOption
  ).value;

  const answerEmbed = new EmbedBuilder()
  .setColor("#59a694")
  .setTimestamp()
  .setFooter({
    text: "Thanks for answering!",
  });

  const sentMessage = await channel.send({
    embeds: [questionEmbed],
    components: [row],
    withResponse: true,
  });

  const collectorFilter = (i) => i.isButton();

  const collector = channel.createMessageComponentCollector({
    filter: collectorFilter,
    time: 1_200_000, // 20 minutes
  });
  collector.on("collect", async (interaction) => {
    const userAnswer = interaction.customId;

    if (userAnswer === correctAnswer) {
      answered = true;
      await interaction.update({
        embeds: [
          answerEmbed
            .setAuthor({ name: "WOO-HOO!" })
            .setDescription(`${interaction.user} got the correct answer! <:jake_exclamation:1290871949186039848>`),
        ],
        components: [],
      });
      collector.stop();
    } else if (userAnswer !== correctAnswer) {
      answered = true;
      const member = await interaction.guild.members.fetch(interaction.user.id);
  
      // console.log(interaction.user);
      await member.timeout(5_000);
      await interaction.update({
        embeds: [
          answerEmbed
            .setAuthor({ name: "WOMP WOMP" })
            .setDescription(`${interaction.user} got the ANSWER WRONG! <:finn_uncomfy:959253867923664987>`)
            .setColor("#ba1e36")
            .setFooter({text: "They've been muted for 5 seconds :/"}),
        ],
        components: [],
      });
      collector.stop();
    }
  });

  collector.on("end", async (reason) => {
    if (!answered && reason !== 'time') {
      await sentMessage.edit({
        embeds: [
          answerEmbed
          .setAuthor({name: "TIME'S UP!"})
          .setDescription("Looks like no one answered in time ")
          .setFooter({text: "Try again next time :/"})
          .setColor("#ffba1e"),
        ],
        components: [],
      });
    }
  });
};

// Bot's online
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  client.user.setActivity('Return to the Nightosphere', { type: ActivityType.Watching });
  setInterval(async () => {
    await sendTriviaQuestion();
}, 25_200_000);    //  7 hrs = 25_200_000

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

  if (timestamps.has(interaction.member.id)) {
    const expirationTime =
      timestamps.get(interaction.member.id) + cooldownAmount;

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
