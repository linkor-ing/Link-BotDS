const { getVoiceConnection } = require('@discordjs/voice');
var stat = true;
module.exports.func = async function (message) {
    const chat = message.channel;
    const voice = await message.member.voice.channel;
    try {
        const connection = getVoiceConnection(voice.guild.id);
        const cvoice = connection.joinConfig.channelId;
        if (!voice || cvoice !== voice.id) return chat.send("Ты не в VoiceChat с ботом");
        if (stat) {
            await connection._state.subscription.player.pause();
            stat = false;
        } else { 
            await connection._state.subscription.player.unpause();
            stat = true;
        }
    } catch (e) {
        console.warn(e);
        return chat.send("Error");
    }
}
module.exports.command = "pause";
module.exports.discr = "Pause music in Voic Chat";