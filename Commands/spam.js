module.exports.command = "s";
module.exports.discr = "Spam to user!";
    perms = new Object;
module.exports.func = async function (client, args, embed) {
    if (args.length < 1) return console.log("Err");
    if (typeof Number(args[1]) != "number") return console.log("Err");
    const count = Number(args[1]);
    const id = args[0];
    if(args[2] == "c"){
        perms.chat = await client.channels.fetch(id);
        var c = true;
        delete args[2];
    }else{
        perms.user = await client.users.fetch(id);
        var c = false;
    }
    delete args[0];
    delete args[1];
    const y = args.join(" ");
    embed.setTitle(y);
    for(let i = 0; i < count; i++){
    if(c == true){
		perms.chat.send({ embeds: [embed] });
    }else{
        perms.user.send({ embeds: [embed] });
		}
    }
}

