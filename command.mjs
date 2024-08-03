import { Client, GatewayIntentBits, Partials, EmbedBuilder, REST, Routes } from 'discord.js';


const token = "MTI2OTI2MzIxODQwMDk1MjM5MQ.GAHWL1.LbaG7pbPR-DSvycZYQ1iwyxOvFcg4e_1dBaRKU";  // Replace with your actual token
const prefix = '!';

// Create a new client instance
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
});

client.once('ready', () => {
    console.log('Ready!');
});

// Slash commands setup
const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands('1269263218400952391'),  // Replace with your actual client ID
            { body: commands }
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

// Message event handler
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.split(' ');

    if (args[0].toLowerCase() === prefix + 'test') {
        const embed = new EmbedBuilder()
            .setTitle('Embed Title')
            .setDescription('This describes the Embed')
            .addFields(
                { name: 'Embed field 1', value: 'Contents', inline: false },
                { name: 'Embed field 2', value: 'Contents', inline: false }
            )
            .setColor('#00FF00')  // Using a hex color value
            .setFooter({ text: 'This bot was Created by ARYAN: <@!482840293347950593>' });

        message.channel.send({ embeds: [embed] });
    }

    if (args[0].toLowerCase() === prefix + 'giverole') {
        const role = message.mentions.roles.first();
        const user = message.mentions.users.first();
        if (role && user) {
            const member = message.guild.members.cache.get(user.id);
            if (member) {
                await member.roles.add(role);
                message.reply(`Role has been given ${role} to ${member}`);
            } else {
                message.reply('User not found.');
            }
        } else {
            message.reply('Please mention only 1 role and 1 user to give.');
        }
    }

    if (args[0].toLowerCase() === prefix + 'removerole') {
        const role = message.mentions.roles.first();
        const user = message.mentions.users.first();
        if (role && user) {
            const member = message.guild.members.cache.get(user.id);
            if (member) {
                await member.roles.remove(role);
                message.reply(`Role has been removed ${role} from ${member}`);
            } else {
                message.reply('User not found.');
            }
        } else {
            message.reply('Please mention only 1 role and 1 user to remove.');
        }
    }
});

// Slash command interaction handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

client.login(token);
