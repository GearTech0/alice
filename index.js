var info = require('./security-info.js');
var discord = require('discord.js');
var drive = require('./drive-api.js');
var pjson = require('./package.json');

var bot = new discord.Client();
var token = info.token;

try {
    bot.on('ready', function () {
        var channel = bot.channels.get('172906855767605249');
        var startup = ['INITIATING ALICE_BOT...', 'ALICE_BOT INITIATED...', 'CONNECTED...', 'Hello, I am Alice. Nice to meet you all!'];
        var i = 0;

        // console.log('STARTED');

         var introduce = setInterval(function(){
             if(i >= startup.length) clearInterval(introduce);
             channel.send(startup[i]);
             i++;
         }, 500);
    });

    bot.on('message', function (msg) {
        var channel = msg.channel;
        if(msg.author.bot) return;
        if(msg.content.indexOf('!') === 0){
            var text = msg.content.substring(1);
            parts = text.split(" ");
            if (parts[0] == "add") {
                if (parts.length <= 1) {
                    msg.reply('Please use the format: !add [email]');
                } else {
                    drive(parts[1], info.fileId);
                    msg.reply('Added ' + parts[1] + ' to the google docs folder.');
                }
            }
            else if(parts[0] == "say"){
                var toUser = channel.members.find('displayName', parts[3]); //.find('nickname', parts[3]); //members.get('username', parts[3]);
                //toUser.sendMessage(parts[1]);
                if(toUser != null)
                    channel.send(parts[1] + " " + toUser);
                else
                    channel.send(parts[3] + " does not seem like a user. Please use the user's Username.");
            }
            else if(parts[0] == "bow" && msg.author.username == "TheOneWhoStands"){
                channel.send("*Bows to my creator*");
            }
            else if(parts[0] == "name")
            {
                msg.reply(msg.author.username);
            }
            else if(parts[0] == 'help')
            {
                var help = [
                    'use `!add [email]` to add your email to the google docs.',
                    'use `!say [word] to [user]` to have me say something to another user',
                    'use `!name` for your username. (This feature was for bug testing, but it was left here for the "lolz")',
                    'use `!thnx` to thank me :)',
                    'use `!github` to view the github link for my project.',
                    'use `!version` to view my version number'
                ];
                var helpText = "";
                for(var text of help)
                {
                    helpText += '\n' + text;
                }

                msg.reply(helpText);
            }
            else if (parts[0] == 'thnx')
            {
                msg.reply('My pleasure.');
            }
            else if (parts[0] == 'github')
            {
                msg.reply('The github link to my programming is: ' + info.githubLink);
            }
            else if (parts[0] == 'version')
            {
                msg.reply('My version number: ' + pjson.version);
            }
        }
    });
    bot.login(token);
} catch (err) {
    console.error(err);
}
