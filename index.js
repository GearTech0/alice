const info = require('./security-info.js');
const discord = require('discord.js');
const drive = require('./drive-api.js');
const pjson = require('./package.json');

var bot = new discord.Client();
const token = info.token;

/**
* TODO:
*  Put on dedicated server
*  On Disconnect parting message
*  Other google functions and cool stuff 
*/

bot.on('message', function (msg) {

    // Abort if a bot has sent a message
    if (msg.author.bot) return;

    // Current channel 
    let channel = msg.channel;

    // Start message token
    if (msg.content.indexOf('!') === 0) {

        let text = msg.content.substring(1);

        parts = text.split(" ");

        if (parts[0] == "add") {
            if (parts.length <= 1) {
                msg.reply('Please use the format: !add [email]').catch(messageHandler);
            } else {
                drive(parts[1], info.fileId);
                msg.reply('Added ' + parts[1] + ' to the google docs folder.').catch(messageHandler);
            }
        }
        else if(parts[0] == "say"){
            let toUser = channel.members.find('displayName', parts[3]);
            if(toUser != null)
                channel.send(parts[1] + " " + toUser).catch(messageHandler);
            else
                channel.send(parts[3] + " does not seem like a user. Please use the user's Username.").catch(messageHandler);
        }
        else if(parts[0] == "bow" && msg.author.username == "TheOneWhoStands"){
            channel.send("*Bows to my creator*").catch(messageHandler);
        }
        else if(parts[0] == "name")
        {
            msg.reply(msg.author.username).catch(messageHandler);
        }
        else if(parts[0] == 'help')
        {
            let help = [
                'use `!add [email]` to add your email to the google docs.',
                'use `!say [word] to [user]` to have me say something to another user',
                'use `!name` for your username. (This feature was for bug testing, but it was left here for the "lolz")',
                'use `!thnx` to thank me :)',
                'use `!github` to view the github link for my project.',
                'use `!version` to view my version number'
            ];
            let helpText = "";
            for (let text of help)
            {
                helpText += '\n' + text;
            }

            msg.reply(helpText).catch(messageHandler);
        }
        else if (parts[0] == 'thnx')
        {
            msg.reply('My pleasure.').catch(messageHandler);
        }
        else if (parts[0] == 'github')
        {
            msg.reply('The github link to my programming is: ' + info.githubLink).catch(messageHandler);
        }
        else if (parts[0] == 'version')
        {
            msg.reply('My version number: ' + pjson.version).catch(messageHandler);
        }
    }
});

// On bot ready
bot.on('ready', () => {

});

// On bot disconnect
bot.on('disconnect', (event) => {

});

// Login to discord server
bot.login(token);

// Used to handle message sending promises 
function messageHandler(err) {
    console.log(err);
}
