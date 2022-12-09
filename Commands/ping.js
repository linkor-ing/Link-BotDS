module.exports.func = function (mchat, embed) {
     embed.setTitle('Pong!');
     mchat.send({embeds:[embed]});
    }
module.exports.command = "ping";
module.exports.discr = "Say Pong!";