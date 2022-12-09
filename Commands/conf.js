const fs = require("fs");
const configs = new Array();
const perems = new Object();

module.exports.command = "conf";
module.exports.discr = "Configuration bot settings.";
module.exports.func = function (config, args, embed, mchat) {
    perems.chat = mchat;
    perems.embed = embed;
    configs.splice(0,configs.length)
    if (args.length < 1 ) return sendEmb("Отсутствую аргументы");
    for (key in config) {
        configs.push(key);
    }
    switch (args[0]) {
        case "get":
            getConf(config, configs, args[1]);
        break;
        case "set":
            config = setConf(config, configs, args);
        break;
        case "add":
            config = addConf(config, configs, args);
        break;
        case "rem":
            config = remConf(config, configs, args[1]);
        break;
        case "save":
            saveConf(config);
        break;
        }
}

function sendEmb(message){
    perems.embed.setTitle(message);
    perems.chat.send({ embeds: [perems.embed] });
}

async function getConf(config, configs, perem) {
    if (configs.indexOf(perem) == -1 && perem != "all" || perem == "token") return sendEmb("Данный параметр не найден"); 
    if(perem == "all") {
        let reslt = JSON.stringify(config).replace("{","").replace("}","").split(',');
        const matches = reslt.filter(s => s.includes('"token"'));
        console.log(matches);
        let num = await reslt.indexOf(matches[0]);
        if (num > -1) {
            console.log(reslt);
            reslt.splice(num, 1);
            console.log(reslt);
        }
        console.log(reslt);
        return sendEmb("Значения переменных " +  reslt.join(", "));
    }
    return sendEmb("Значение переменной " + perem + ":" + config[perem]);
}

function setConf(config, configs, args) {
    args.shift();
    let perem = args.shift();
    let data = args.join(" ");
    if (configs.indexOf(perem) == -1 || perem == "token" || perem == "OwnerId" || perem == "prefix" ) return sendEmb("Данный параметр не найден или read-only");
    if (!data) return sendEmb("Значение не может быть пустым");
    if (data.length == 0) return sendEmb("Значение не может быть пустым");
    let odata = config[perem];
    config[perem] = data
    outputc = config;
    sendEmb("Значение переменной было: " + odata + "\n Стало значение: " + data);
    return outputc;
}

function addConf(config, configs, args) {
    args.shift();
    let perem = args.shift();
    let data = args.join(" ");
    if (configs.indexOf(perem) !== -1 ) return sendEmb("Данный параметр существует");
    config[perem] = data;
    let outputc = config
    if (!data) return sendEmb("Переменная " + perem + "была создана");
    if (data.length == 0) return sendEmb("Переменная " + perem + " была создана");
    sendEmb("Переменная " + perem + " была создана со значением : " + data);
    return outputc;
}

function remConf(config, configs, perem) {
    if (configs.indexOf(perem) == -1 || perem == "token" || perem == "OwnerId" || perem == "prefix" ) return sendEmb("Данный параметр не найден или read-only");
    delete config[perem];
    sendEmb("Переменная " + perem + " была удалена");
    let outputc = config;
    return outputc;
}

function saveConf(nconfig) {
    if(!nconfig){
        sendEmb("Нечего сохранять");
        return mchat.send({embeds:[embed]})
    }
    fs.writeFile("/Users/Сергей/Downloads/Проекты/Bot Ds/config.json", JSON.stringify(nconfig), function(err) {
        if (err) {
            console.log(err);
        }
        sendEmb("Конфигурация сохранена");
    });
}
