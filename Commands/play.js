const { joinVoiceChannel, createAudioPlayer, AudioPlayerStatus, createAudioResource, getVoiceConnection, NoSubscriberBehavior } = require ("@discordjs/voice");
const youtubedl = require('youtube-dl-exec');
const perms = {};
const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});
const queue = [];
const queueN = [];

module.exports.func = function ( message, args, embed ) {
    perms.chat = message.channel;
    perms.voice = message.member.voice.channel;
    if(!args[0] || !perms.voice) return perms.chat.send('Отсутствует Источник или вы не зашли в VoiceChat');
    if (!~args[0].indexOf("https") || !~args[0].indexOf("http")) return chat.send("Сообщение не содержит ссылку");
    perms.connection = getVoiceConnection(message.member.voice.channel.guild.id);
    if(perms.connection !== undefined){
      const cvoice = perms.connection.joinConfig.channelId;
      if(cvoice !== perms.voice.id) return perms.chat.send('Ты не в VoiceChat с ботом');
    }
    if (~args[0].indexOf("https://www.youtube.com") || ~args[0].indexOf("https://youtu.be") || ~args[0].indexOf("https://music.youtube.com/")){
      const video = youtubedl(args[0], {
        dumpSingleJson: true,
        noWarnings: true,
        audioFormat: 'mp3',
        audioQuality: 0,
        noCheckCertificate: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true,
        referer: 'https://google.com'
      }).then(async output => {
        let data = await firstA(output.requested_downloads[0].requested_formats);
        if(data != null){
          queue.push(data);
          queueN.push(output.title);
        }else{
          return console.log(null);
        }
        if (queue.length > 1) return console.log("Song added! " + queue);
        perms.resource = createAudioResource(queue[0]);
        perms.connection = joinVoiceChannel({
          channelId: perms.voice.id,
          guildId: perms.voice.guild.id,
          adapterCreator: perms.voice.guild.voiceAdapterCreator,
        });
        perms.subscription = perms.connection.subscribe(player);
        player.play(perms.resource);
        console.log('Song Playing! ' + queue);
      })
      .catch(err => console.error(err));
    }else{
     // embed.setTitle("Временно не поддерживается DirectURL!");
     // perms.chat.send({embeds:[embed]});
          if(args[0].indexOf('&play=false')){
            const test = args[0].replace('&play=false', '&play=true');
            queueN.push(test.split('/').pop().split('&').shift());
            queue.push(test);
          }else{
            queueN.push(args[0].split('/').pop());
            queue.push(args[0]);
          }
        if (queue.length > 1) return console.log("Song added! " + queue);
        
        perms.resource = createAudioResource(queue[0]);
        perms.connection = joinVoiceChannel({
          channelId: perms.voice.id,
          guildId: perms.voice.guild.id,
          adapterCreator: perms.voice.guild.voiceAdapterCreator,
        });
        perms.subscription = perms.connection.subscribe(player);
        player.play(perms.resource);
        console.log('Song Playing! ' + queue);
    }


    player.on(AudioPlayerStatus.Playing, () => {
      // info
    });
  
    player.on(AudioPlayerStatus.Idle, () => {
      if (queue.length > 1) {
      try {
        queue.shift();
        queueN.shift();
        perms.resource = createAudioResource(queue[0]);
        console.log("Next Song!");
        player.play(perms.resource);
      } catch (err) {console.warn(err);}}
      });
}
module.exports.command = "play";
module.exports.discr = "Join and playing music";

// Далее часть отвечает за запрос очереди

module.exports.qcommand = "queue";
module.exports.qdiscr = "Check the queue music!";

module.exports.qfunc = async function (message, embed) {
  const chat = message.channel;
  if(queue.length < 1) {
    embed.setTitle("Очереди нет!!");
    return chat.send({embeds:[embed]})}
  mes = '';
  queueN.forEach(function(item, i, arr) {
  if(mes != '') {
      mes += ' \n ' + (i+1) + ') ' + item;
    }else{
        mes = '1)' + item;
  }
  });
  embed.setTitle(mes);
  chat.send({embeds:[embed]});
}

function firstA(data){
  for(let i = 0; i <= data.length; i++){
    if(data[i].acodec != 'none'){
      return data[i].url;
    }
  }
  return null;
}