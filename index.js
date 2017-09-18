const info = require('./helpers/security-info.js');
const drive = require('./helpers/drive-api.js');
const pjson = require('./package.json');
const email = require('./helpers/email-tracker.js');


const discord = require('discord.js');
const cluster = require('cluster');
const exec = require('child_process').exec;

const GITHUB = 'https://github.com/GearTech0/alice';
const CREATOR = 'TheOneWhoStands';

var bot = new discord.Client();
const token = info.token;

/**
* TODO:
*  Put on dedicated server
*  On Disconnect parting message
*  Other google functions and cool stuff
*/

if (cluster.isMaster) {
    cluster.fork();

    cluster.on('exit', (worker) => {
        console.log('Alice has restarted with id: ' + worker.id);
        console.log('Restarting...');

        cluster.fork();
    });
} else {
    bot.on('message', function (msg) {

        // Abort if a bot has sent a message
        if (msg.author.bot) return;

        // Current channel
        let channel = msg.channel;

        //
        if (msg.content.toLowerCase().startsWith("fuck you") && msg.author.username == CREATOR) {
            channel.send('Yeah, fuck you!').catch(messageHandler);
        }

        // Start message token
        if (msg.content.indexOf('!') === 0) {

            let text = msg.content.substring(1);

            parts = text.split(' ');

            if (parts[0] == 'add') {
                if (parts.length <= 1) {
                    msg.reply('Please use the format: `!add [email]` or `!add [email] [fileID]`').catch(messageHandler);
                } else if (parts.length == 2) {
                    email.isFound(parts[1], info.fileId, (found) => {
                        if (found) {
                            msg.reply('You have already been shared to that file. Please check your email');
                        }
                        else {
                            drive(parts[1], info.fileId);
                            msg.reply('Added ' + parts[1] + ' to the google docs folder.').catch(messageHandler);
                            email.add(parts[1], info.fileId);
                        }
                    });
                } else if (parts.length == 3) {
                    email.isFound(parts[1], parts[2], (found) => {
                        if (found) {
                            msg.reply('You have already been shared to that file. Please check your email');
                        }
                        else {
                            drive(parts[1], parts[2]);
                            msg.reply('Added ' + parts[1] + ' to the folderId.').catch(messageHandler);
                            email.add(parts[1], parts[2]);
                        }
                    });
                }
            }
            else if (parts[0] == 'say') {
                let toUser = channel.members.find('displayName', parts[parts.length - 1]);
                if (toUser != null) {
                    let sayString = "";
                    for (let i = 1; i < parts.length; i++) {
                        if (parts[i] == "to") break;
                        sayString += parts[i] + ' ';
                    }
                    channel.send(sayString + " " + toUser).catch(messageHandler);
                }
                else
                    channel.send(parts[3] + " does not seem like a user. Please use the user's Username.").catch(messageHandler);
            }
            else if (parts[0] == 'bow' && msg.author.username == CREATOR) {
                channel.send("*Bows to my creator*").catch(messageHandler);
            }
            else if (parts[0] == 'name') {
                msg.reply(msg.author.username).catch(messageHandler);
            }
            else if (parts[0] == 'help') {
                let help = [
                    'use `!add [email]` to share the google docs to [email]. Remember to accept the email verification!',
                    'use `!say [sentence] to [user]` to have me say something to another user.',
                    'use `!name` for your username. (This feature was for bug testing, but it was left here for the "lolz")',
                    'use `!thnx` to thank me :)',
                    'use `!github` to view the github link for my project.',
                    'use `!version` to view my version number.',
                    'use `!update` to update me to my most recent version.'
                ];
                let helpText = '';
                for (let text of help) {
                    helpText += '\n' + text;
                }

                msg.reply(helpText).catch(messageHandler);
            }
            else if (parts[0] == 'thnx') {
                msg.reply('My pleasure.').catch(messageHandler);
            }
            else if (parts[0] == 'github') {
                msg.reply('The github link to my programming is: ' + GITHUB).catch(messageHandler);
            }
            else if (parts[0] == 'version') {
                msg.reply('My version number: ' + pjson.version).catch(messageHandler);
            }
            else if (parts[0] == 'update' && msg.author.username == CREATOR) {
                // Update the bot
                channel.send('Updating...').catch(messageHandler);
                exec('git pull origin master', (err, stdout, stderr) => {
                    if (err) {
                        console.log('Cannot Pull: ' + err);
                        channel.send('Cannot pull...').catch(messageHandler);
                        return;
                    }
                    if (stderr.toLocaleLowerCase().localeCompare('already up-to-date.') == 0)
                        channel.send('Already up-to-date.').catch(messageHandler);
                    else
                        channel.send('Updated to newest version.').catch(messageHandler);
                    setTimeout(() => {
                        process.exit();
                    }, 1000);
                });
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
    bot.login(token).catch((err) => {
        console.log(err);
    });
}

// Used to handle message sending promises
function messageHandler(err) {
    console.log(err);
}
