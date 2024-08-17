require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events
} = require("discord.js");
const client = new Client({
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
const BOOSTER_ROLE_ID = "1174192479239688244"; // Replace with your server's booster role ID

client.on("ready", () => {
  console.log(`Bot is online, ${client.user.tag}!`);
});




client.on('guildMemberUpdate', (oldMember, newMember) => {
    if (oldMember.premiumSince === null && newMember.premiumSince !== null) {
        // User has boosted the server
        const channel = client.channels.cache.get(CHANNEL_ID);
        if (channel) {
            const embed = new EmbedBuilder()
                .setColor('#00FF00') // Green color for the embed
                .setTitle('🚀 Server Boost!')
                .setDescription(`${newMember.user.tag} has boosted the server! 🎉`)
                .setTimestamp();

            channel.send({ embeds: [embed] });
        } else {
            console.error('Channel not found');
        }
    }

//   if (
//     !oldMember.roles.cache.has(
//       newMember.guild.roles.premiumSubscriberRole?.id
//     ) &&
//     newMember.roles.cache.has(newMember.guild.roles.premiumSubscriberRole?.id)
//   ) {
//     const boostAnnounceEmbed = new EmbedBuilder()
//       .setAuthor({
//         name: `Congratulations we have new booster!`,
//         iconURL: newMember.guild.iconURL({ size: 1024 }),
//       })
//       .setDescription(
//         `>>> Dear ${newMember}, You are really awesome and amazing.\nThanks for boosting our server, Enjoy your ${newMember.guild.roles.premiumSubscriberRole} role and other exclusive perks.`
//       )

//       .setImage(
//         "https://cdn.discordapp.com/attachments/997473822787780669/1235649668978053181/p1_3187142_731753fb_LE_auto_x2_result.png?ex=663523ee&is=6633d26e&hm=7d7f3b33acb09f05a277802035cf84b79f8982eb1d01c73d0e8e60a85c23af78&"
//       )
//       .setColor("F47FFF")
//       .setFooter({
//         text: `${newMember.guild.name} Boost Detection System`,
//         iconURL: newMember.user.displayAvatarURL({ size: 1024 }),
//       })
//       .setTimestamp();

//     const msg = await boostAnnounceChannel.send({
//       content: `${newMember} \`${newMember}\``,
//       embeds: [boostAnnounceEmbed]

//     });

    // const member = message.mentions.members.first();

    //     if (!member) {
    //         return message.reply('Please mention a member to mute.');
    //     }

    //     if (!message.member.roles.cache.has(BOOSTER_ROLE_ID)) {
    //         return message.reply('You do not have permission to use this command.');
    //     }

    //     if (!member.moderatable) {
    //         return message.reply('I cannot mute this user.');
    //     }

    //     try {
    //         await member.timeout(60000, 'Muted by booster command');
    //         // message.reply(`${member.user.tag} has been muted for 30 seconds.`);
    //         const newEmbed = new EmbedBuilder()
    //         .setColor(0x0099FF)
    //         .setTitle('Fall')
    //         .setDescription(`${member.user.tag} has been muted for 30 seconds`)
    //         .setImage('https://media1.tenor.com/m/bT-kVojT-X0AAAAC/adventure-time-fall.gif')

    //         message.reply({ embeds: [newEmbed]});
    //     } catch (error) {
    //         console.error('Error muting member:', error);
    //         message.reply('There was an error trying to mute the member.');
    //     }
    // }
    // // Nickname Change Command
    // if (message.content.startsWith(`${PREFIX}nickname`)) {
    //     const args = message.content.split(' ');
    //     const member = message.mentions.members.first();
    //     const newNickname = args.slice(2).join(' ');

    //     if (!member) {
    //         return message.reply('Please mention a member to change their nickname.');
    //     }

    //     if (!newNickname) {
    //         return message.reply('Please provide a new nickname.');
    //     }

    //     if (!message.member.roles.cache.has(BOOSTER_ROLE_ID)) {
    //         return message.reply('You do not have permission to use this command.');
    //     }

    //     if (!member.manageable) {
    //         return message.reply('I cannot change this user\'s nickname.');
    //     }

    //     try {
    //         await member.setNickname(newNickname);
    //         // message.reply(`Changed ${member.user.tag}'s nickname to "${newNickname}".`);
    //         const newEmbed = new EmbedBuilder()
    //             .setColor(0x0099FF)
    //             .setTitle('Transfigured')
    //             .setDescription(`${member.user.tag} has been transfigured`)
    //             .setImage('https://64.media.tumblr.com/95f6e6a6a0cc5f8adb53c3f3c522bb9d/tumblr_mhqzex3FNw1rzn9loo1_500.gif')

    //             message.reply({ embeds: [newEmbed]});
    //     } catch (error) {
    //         console.error('Error changing nickname:', error);
    //         message.reply('There was an error trying to change the nickname.');
    //     }
    // }
    // if (message.content.startsWith(`${PREFIX}evil`)) {
    // const newEmbed = new EmbedBuilder()
    // .setColor(0x0099FF)
    // .setImage('https://media1.tenor.com/m/I1R3IIAKBRQAAAAC/gunther-gunther-adventure-time.gif')

    // message.send({ embeds: [newEmbed] });
  }

  // https://media1.tenor.com/m/I1R3IIAKBRQAAAAC/gunther-gunther-adventure-time.gif
);


client.login(process.env.BOT_TOKEN); // Replace with your bot token
