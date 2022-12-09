var baf = undefined;
const perems = new Array();

module.exports.discr = "Clown";
module.exports.func = function (client, embed, chatid) {
    perems.embed = embed;
    perems.chat = client.channels.fetch(chatid);
    

function sendEmb(message){
    perems.embed.setTitle(message);
    perems.chat.send({ embeds: [perems.embed] });
}