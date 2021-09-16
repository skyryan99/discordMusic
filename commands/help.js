//For user info
module.exports = {
    name: 'help',
    aliases: ['h', 'commands'],
    description: "gives tiops on how to use bot",
    async execute(message, args) {

        await message.channel.send('\n**Commands**\n\n'
            + '*-play [-p]*: Summons the musical man or queues a song\n\n'
            + '*-skip [-next]*: Moves to the next song\n\n'
            + '*-queue [-q], [-show]*: Displays all songs in current queue\n\n'
            + '*-move [-m]*: Moves song A to the position of song B\n\n'
            + '*-stack [-s]*: Queues a song to play next\n\n'
            + '*-remove [-r]*: Takes a song out of the queue\n\n'
            + '*-leave [-stop]*: Yeets musical man out of the channel');

    }
}