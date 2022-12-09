const { getVoiceConnection } = require('@discordjs/voice');
module.exports.func = async function (message) {
    const chat = message.channel;
    const voice = await message.member.voice.channel;
    try {
        const connection = getVoiceConnection(voice.guild.id);
        const cvoice = connection.joinConfig.channelId;
        if (!voice || cvoice !== voice.id) return chat.send("Ты не в VoiceChat с ботом");
        await connection.destroy();
    } catch (e) {
        console.warn(e);
        return chat.send("Error");
    }
}
module.exports.command = "stop";
module.exports.discr = "Leave on the Voice Chat";