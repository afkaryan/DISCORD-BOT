const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const SpotifyWebApi = require('spotify-web-api-node');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

const token = 'MTI2OTI2MzIxODQwMDk1MjM5MQ.GAHWL1.LbaG7pbPR-DSvycZYQ1iwyxOvFcg4e_1dBaRKU';
const spotifyClientId = 'YOUR_SPOTIFY_CLIENT_ID';
const spotifyClientSecret = 'YOUR_SPOTIFY_CLIENT_SECRET';
const redirectUri = 'YOUR_SPOTIFY_REDIRECT_URI';

const spotifyApi = new SpotifyWebApi({
    clientId: spotifyClientId,
    clientSecret: spotifyClientSecret,
    redirectUri: redirectUri
});

client.once('ready', () => {
    console.log('Ready!');
});

client.on('messageCreate', async message => {
    if (message.content.startsWith('!play')) {
        const args = message.content.split(' ');
        const url = args[1];
        if (!url) {
            message.reply('Please provide a Spotify track URL.');
            return;
        }

        try {
            const trackId = url.split('track/')[1].split('?')[0];
            const data = await spotifyApi.clientCredentialsGrant();
            spotifyApi.setAccessToken(data.body['access_token']);

            const trackInfo = await spotifyApi.getTrack(trackId);
            const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(trackInfo.body.name + ' ' + trackInfo.body.artists[0].name)}`;

            const connection = joinVoiceChannel({
                channelId: message.member.voice.channelId,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            const videoUrl = await getYouTubeUrl(youtubeUrl);

            const player = createAudioPlayer();
            const resource = createAudioResource(ytdl(videoUrl, { filter: 'audioonly' }));

            player.play(resource);
            connection.subscribe(player);

            player.on(AudioPlayerStatus.Playing, () => {
                message.channel.send(`Now playing: ${trackInfo.body.name} by ${trackInfo.body.artists[0].name}`);
            });

            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
            });

        } catch (error) {
            console.error(error);
            message.reply('There was an error playing the track.');
        }
    }
});

async function getYouTubeUrl(searchQuery) {
    const axios = require('axios');
    const { data } = await axios.get(searchQuery);
    const videoId = data.split('href="/watch?v=')[1].split('"')[0];
    return `https://www.youtube.com/watch?v=${videoId}`;
}

client.login(token);

