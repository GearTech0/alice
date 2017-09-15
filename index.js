var info = require('./security-info.js');
var discord = require('discord.js');
var drive = require('./drive-api.js');

var bot = new discord.Client();
var token = info.token;

try {
    bot.on('ready', function () {
        var channel = bot.channels.get('172906855767605249');
        var startup = ['INITIATING ALICE_BOT...', 'ALICE_BOT INITIATED...', 'CONNECTED...', 'Hello, I am Alice. Nice to meet you all!'];
        var i = 0;

        // console.log('STARTED');

        // var introduce = setInterval(function(){
        //     if(i >= startup.length) clearInterval(introduce);
        //     channel.send(startup[i]);
        //     i++;
        // }, 500);
    });

    bot.on('message', function(msg) {
        var channel = bot.channels.get('172906855767605249');
        if(msg.author.bot) return;
        if(msg.content.indexOf('!') === 0){
            var text = msg.content.substring(1);
            parts = text.split(" ");
            if(parts[0] == "add"){
                drive('sourhead5@gmail.com');
                msg.reply(text);
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
        }
    });
    bot.login(token);
} catch (err) {
    console.error(err);
}
