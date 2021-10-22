//For user info
module.exports = {
    name: 'help',
    aliases: ['h', 'commands'],
    description: "gives tiops on how to use bot",
    async execute(message, args) {

        await message.channel.send('The musical man is so far only compatible with youtube links and searches.\n'
            + 'Support for playlists and spotify links will be implemented in the future.\n\n'
            + '*** Commands ***\n\n'
            + '**-play, -p**: Summons the musical man or queues a song\n\n'
            + '**-skip, -next**: Moves to the next song\n\n'
            + '**-queue, -q, -show [-N]**: Displays next N songs (default 5) in current queue\n\n'
            + '~~**-move, -m**: Moves song A to the position of song B~~\n\n'
            + '~~**-stack, -s**: Queues a song to play next~~\n\n'
            + '~~**-remove, -r**: Takes a song out of the queue~~\n\n'
            + '**-leave, -stop**: Yeets musical man out of the channel\n\n'
            + '*MORE TO COME...*\n\n'
            + 'P.S. For any bug reports, pm SwankyMango#1457 with details');

    }
}
