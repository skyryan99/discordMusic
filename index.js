// JS index
const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'ODg3OTY3ODMyNzk5ODcxMDE2.YUL2fA.X4jm42JgvbQJkA1YwE6QYUYF1YQ';
const prefix = '-';
const fs = require('fs');

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('Bot online.');
})

client.on('message', message => {
    //Make sure starts with proper prefix, and isn't a bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    //Splice that shit
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    //Command handler
    try {
        command.execute(message, args, cmd, client, Discord);
    }
    catch (err) {
        message.channel.send("Error handling command");
    }
})


client.login(token);
