import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.on('messageCreate', message => {
    if(message.author.bot) return;
    message.reply({
        content: "AUR BHAI KAISA H",
    });
    //console.log(message);
});
client.on("interactionCreate", (Intersection) => {
    console.log(Interaction);
    interaction.reply("OKAY!!")
});
client.login("MTI2OTI2MzIxODQwMDk1MjM5MQ.GAHWL1.LbaG7pbPR-DSvycZYQ1iwyxOvFcg4e_1dBaRKU")
