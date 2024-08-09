const { Client, GatewayIntentBits, Events, PermissionsBitField } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

const PREFIX = '.';
const BOOSTER_ROLE_ID = '1174192479239688244'; // Replace with your server's booster role ID

client.once(Events.ClientReady, () => {
    console.log('Bot is online!');
});

client.on(Events.MessageCreate, async (message) => {
    if (!message.guild || message.author.bot) return;

    if (message.content.startsWith(`${PREFIX}fall`)) {
        const member = message.mentions.members.first();
        
        if (!member) {
            return message.reply('Please mention a member to mute.');
        }
        
        if (!message.member.roles.cache.has(BOOSTER_ROLE_ID)) {
            return message.reply('You do not have permission to use this command.');
        }

        if (!member.moderatable) {
            return message.reply('I cannot mute this user.');
        }

        try {
            await member.timeout(60000, 'Muted by booster command');
            message.reply(`${member.user.tag} has been muted for 30 seconds.`);
        } catch (error) {
            console.error('Error muting member:', error);
            message.reply('There was an error trying to mute the member.');
        }
    }
});

client.login('MTI3MTI3OTk5MDA1ODY1MTY3OA.GUbWeZ.XsRcF4NWwZ1qzHdvgjU3Ne5c9-BZOI206RjX24'); // Replace with your bot token
