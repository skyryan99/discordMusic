//JS for all commands that deal with the songQueue
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const queue = new Map();//queue(message.quild.id, queue_constructor object {vc, text channel, connection, song[]});

module.exports = {
    name: 'play',
    aliases: ['p', 'skip', 'stop', 'leave', 'queue', 'show', 'q'],
    description: "joins vc and plays music from yt",
    async execute(message, args, cmd, client, Discord) {

        var voiceChannel = message.member.voice.channel;

        //Make sure user is in vc
        if (!voiceChannel) return message.channel.send('Must be in a voice channel to summon the musical man!');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        //Make sure user has appropriate permissions
        if (!permissions.has('CONNECT')) return message.channel.send('You do not have permission to join this channel');
        if (!permissions.has('SPEAK')) return message.channel.send('You do not have permission to speak in this channel');

        const serverQueue = queue.get(message.guild.id);

        if (cmd == 'play' || cmd == 'p') {
            //Make sure command call actually has an argument
            if (!args.length) return message.channel.send('Must specify song name or URL');
            let song = {};

            //See if a link or keywords
            if (ytdl.validateURL(args[0])) {
                const songInfo = await ytdl.getInfo(args[0]);
                song = { title: songInfo.videoDetails.title, url: songInfo.videoDetails.video_url }
            }
            else {
                const videoFinder = async (query) => {
                    const videoResult = await ytSearch(query);
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }

                const video = await videoFinder(args.join(' '));
                if (video) {
                    song = { title: video.title, url: video.url }
                }
                else {
                    message.channel.send('Sorry! No results found...');
                }
            }

            //If first song
            if (!serverQueue) {
                const queueConstructor = {
                    voiceChannel: voiceChannel,
                    textChannel: message.channel,
                    connection: null,
                    songs: []
                }

                queue.set(message.guild.id, queueConstructor);
                queueConstructor.songs.push(song);
                message.channel.send(`***${song.title}*** added to queue!`);

                try {
                    const connection = await voiceChannel.join();
                    queueConstructor.connection = connection;
                    videoPlayer(message.guild, queueConstructor.songs[0])
                }
                catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send('Error connecting...');
                }
            }
            else {
                serverQueue.songs.push(song);
                return message.channel.send(`***${song.title}*** added to queue!`);
            }
        }
        else if (cmd == 'skip') skipSong(message, serverQueue);
        else if (cmd == 'stop' || cmd == 'leave') leaveVC(message, serverQueue);
        else if (cmd == 'show' || cmd == 'queue' || cmd == 'q') {
            if (args && /^\d+$/.test(args[0])) {
                var num = Math.min(parseInt(args[0], 10), 20);
            }
            else {
                var num = 5;
            }
            printQueue(message, serverQueue, num);
        }
        //else if (cmd == 'move' || cmd == 'm')
        //else if (cmd == 'stack' || cmd == 's')
        //else if (cmd == 'remove' || cmd == 'r')
    }
}

const videoPlayer = async (guild, song) => {
    const songQueue = queue.get(guild.id);

    if (!song) {
        songQueue.textChannel.send(':wave:');
        songQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    else {
        await songQueue.textChannel.send(`:musical_note: Now Playing ***${song.title}*** :musical_note:`);
        const stream = ytdl(song.url, { filter: 'audioonly' });
        songQueue.connection.play(stream, { seek: 0, volume: 1 })
            .on('finish', () => {
                songQueue.songs.shift();
                videoPlayer(guild, songQueue.songs[0]);
            });
    }
}

const skipSong = (message, serverQueue) => {
    //user must be in vc
    if (!message.member.voice.channel) return message.channel.send('Must be in a voice channel to boss around the musical man!')
    //if there is no queue
    if (!serverQueue) {
        return message.channel.send('The queue is empty!');
    }
    //end current song
    serverQueue.connection.dispatcher.end();
}

const leaveVC = (message, serverQueue) => {
    //use must be in vc
    if (!message.member.voice.channel) return message.channel.send('Must be in a voice channel to boss around the musical man!');
    //if any songs queued, destroy them
    if (serverQueue) serverQueue.songs = [];
    //if bot in vc, leave and say goodbye
    if (message.member.voice.connection) {
        serverQueue.connection.dispatcher.end();
        message.channel.send(':wave:');
    }
}

const printQueue = (message, serverQueue, num) => {
    //default is 5 entries, prints out NUM
    for (let i = 0; i < num; i++) {
        try {
            message.channel.send("```" + (i + 1) + ": " + serverQueue.songs[i].title + "```");
        }
        catch {
            message.channel.send("```" + (i + 1) + ": -------------```");
        }
    }
}