const rls = require("rls-api");
const Discord = require('discord.js');
const discordClient = new Discord.Client();
const fs = require("fs");
const rlsClient = new rls.Client({
    token: fs.readFileSync("tokens/rlstoken","utf8")
});
discordClient.login(fs.readFileSync("tokens/discordtoken","utf8")).then(t => console.log("Logged in on discord."));

discordClient.on('message', msg => {
    let commandName = msg.content.split(" ")[0];
    let command = mapCommandNameToCommand(commandName);
    if (typeof command === 'undefined') {
        return;
    }
    command.handle(msg);


});

let setRankHandler = (msg) => {
    let msgSplit = msg.content.split(" ");

    if (msgSplit.length !== 3) {
        msg.reply("You should pass 2 arguments");
        return;
    }

    let platform = mapPlatformNameToPlatform(msgSplit[1]);
    let id = msgSplit[2];

    if (typeof platform === 'undefined' || typeof id === 'undefined') {
        msg.reply("Either platform or id is unknown");
        return;
    }

    rlsClient.getPlayer(id, platform, function (status, data) {
        if (status === 200) {
            let lastSeasonKey = getHighestKey(Object.keys(data["rankedSeasons"]));
            let lastSeason = data["rankedSeasons"][lastSeasonKey];
            let highestRank = getHighestRank(lastSeason);
            let tierName = mapPlaylistToTierName(highestRank);
            let role = mapRoleNameToGuildRole(tierName, msg.guild);
            let allRankRoles = getAllRankedRoles(msg.guild);
            msg.member.removeRoles(allRankRoles).then(()=>{
                msg.member.addRole(role.id).then(() => {
                    msg.reply("All set!");
                });
            })
        } else {
            if (status === 404) {
                msg.reply("Can not find that player, check that it is the correct ID and platform");
            }
        }
    });
};

const commands = Object.freeze({
    RANK_TO_ROLE: Object.freeze({
        name: ".role",
        handle: setRankHandler
    }),
});

let mapRoleNameToGuildRole = (roleName, guild) => {
    return guild.roles.find(r=>{
        return r.name === roleName;
    });
};

let getAllRankedRoles = guild => {
    return guild.roles.filter(r=>{
        return typeof Object.keys(tierToNameMap).find(k=>tierToNameMap[k] ===r.name) !== 'undefined' ;
    });

};

let mapCommandNameToCommand = (commandName) => Object.keys(commands).map(k => commands[k]).find(c => c.name === commandName);
let mapPlaylistToTierName = (playlist) => tierToNameMap[playlist['tier']];
let mapPlatformNameToPlatform = (name) => {
    switch (name) {
        case "pc" :
            return rls.platforms.STEAM;
        case "ps4" :
            return rls.platforms.PS4;
        case "xbox" :
            return rls.platforms.XB1;
    }
};

const tierToNameMap = {
    1: "Bronze1",
    2: "Bronze2",
    3: "Bronze3",
    4: "Silver1",
    5: "Silver2",
    6: "Silver3",
    7: "Gold1",
    8: "Gold2",
    9: "Gold3",
    10: "Platinum1",
    11: "Platinum2",
    12: "Platinum3",
    13: "Diamond1",
    14: "Diamond2",
    15: "Diamond3",
    16: "Champion1",
    17: "Champion2",
    18: "Champion3",
    19: "GrandChampion"
};

let getHighestKey = (keys) => keys.sort((a, b) => b - a)[0];
let getHighestRank = (seasonData) => Object.keys(seasonData).map((k) => seasonData[k]).sort(sortRank)[0];
let sortRank = (a, b) => b["rankPoints"] - a["rankPoints"];