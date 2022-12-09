const { Client, Intents, MessageEmbed } = require("discord.js");
const { generateDependencyReport } = require ("@discordjs/voice");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});
const config = require("./config.json");
const ping = require('./Commands/ping');
const play = require('./Commands/play');
const stop = require('./Commands/stop');
const pause = require('./Commands/pause');
const skip = require('./Commands/skip');
const spam = require('./Commands/spam');
const conf = require('./Commands/conf');

client.on("ready", () => {
    console.log("I am ready! Prefix: " + config.prefix);
  });

client.on("voiceStateUpdate", (oldVoiceState, newVoiceState) => {
  const embed = new MessageEmbed()
	  .setColor('#0099ff')
    .setAuthor({ name: client.user.username , iconURL: client.user.avatarURL()});
  if (newVoiceState.channel) { // The member connected to a channel.
    if(newVoiceState.member.roles.cache.find(role => role.name == 'Clown🤡') == undefined) return
    embed.setTitle(config["clown_text_i"]);
    newVoiceState.guild.channels.cache.find(c => c.id === config[newVoiceState.guild.id]).send({embeds:[ embed ]}).catch(e => console.error(e));
  } else if (oldVoiceState.channel) { // The member disconnected from a channel.
    if(newVoiceState.member.roles.cache.find(role => role.name == 'Clown🤡') == undefined) return
    embed.setTitle(config["clown_text_o"]);
    newVoiceState.guild.channels.cache.find(c => c.id === config[newVoiceState.guild.id]).send({embeds:[ embed ]}).catch(e => console.error(e));
  };
});

  client.on("messageCreate", (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;
    // if (message.author.id !== config.ownerID) return; // Owner mod
  
    const embed = new MessageEmbed()
	  .setColor('#0099ff')
    .setAuthor({ name: client.user.username , iconURL: client.user.avatarURL()});
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const mchat = message.channel;
    switch (command) {
        case ping.command:
          ping.func(mchat, embed);
        break;
        case pause.command:
          pause.func(message, embed);
        break;
        case play.command:
          play.func(message, args, embed);
        break;
        case stop.command:
          stop.func(message, embed);
        break;
        case play.qcommand:
          play.qfunc(message, embed);
        break;
        case skip.command:
          skip.func(message, embed);
        break;
        case spam.command:
          if(message.author.id != config.OwnerId && message.author.id != config.RuslanId) return mchat.send("Error: 403");
          spam.func(client, args, embed);
        break;
        case conf.command:
          if(message.author.id != config.OwnerId && message.author.id != config.RuslanId) return mchat.send("Error: 403");
          var nconfig = conf.func(config, args, embed, mchat);
        break;
        case "debug":
          console.log(generateDependencyReport());
        break;
        default:
          mchat.send("Command not found!");
          console.log(command);
        break;
      }

  });
// Сделать тайм-аут
client.login(config.token);