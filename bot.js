const Discord = require("discord.js")
const config = require('dotenv').config().parsed;
const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES"]})

client.on("ready", async () => {
    /*const guild = await client.guilds.fetch(config.SERVER);
    const role = await guild.roles.fetch(config.VERIFY_ROLE);
    console.log(role);
    console.log(role.members);*/

    console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", async msg => {
    console.log(msg.author);
    if (msg.content === "Do you love me?") {
        msg.reply("I love you :heart:");
    }
    if (msg.content === "!verify") {
        if (msg.member.roles.cache.find(e => e.id === config.VERIFY_ROLE)) {
            msg.reply("You has a role!");
        } else {
            await msg.member.roles.add(config.VERIFY_ROLE);
            msg.reply("Verified!");
        }
    }
})

const check_role = async (user_name, discriminator) => {
    const guild = await client.guilds.fetch(config.SERVER);
    const members = await guild.members.fetch();
    let user = members.find(e => e.user.username === user_name && e.user.discriminator === discriminator.toString());
    return user.roles.cache.some(e => e.id === config.VERIFY_ROLE);
}

const set_role = async (user_name, discriminator) => {
    const guild = await client.guilds.fetch(config.SERVER);
    let user = await check_user(user_name, discriminator);
    const role = await guild.roles.fetch(config.VERIFY_ROLE);
    await user.roles.add([role])
    await send_set_role_msg(user_name);
    return null
}

const remove_role = async (user_name, discriminator) => {
    let user = await check_user(user_name, discriminator);
    const guild = await client.guilds.fetch(config.SERVER);
    const role = await guild.roles.fetch(config.VERIFY_ROLE);
    await user.roles.remove([role])
    await send_remove_role_msg(user_name);
    return null
}

const check_user = async (user_name, discriminator) => {
    const guild = await client.guilds.fetch(config.SERVER);
    const members = await guild.members.fetch();
    return members.find(e => e.user.username === user_name && e.user.discriminator === discriminator.toString());
}

const send_set_role_msg = async (user_name) => {
    const channel = await client.channels.cache.get(config.MAIN_CHANNEL_ID);
    await channel.send(`Welcome user ${user_name}!`);
}

const send_remove_role_msg = async (user_name) => {
    const channel = await client.channels.cache.get(config.MAIN_CHANNEL_ID);
    await channel.send(`Buy user ${user_name}!`);
}


client.login(config.TOKEN);

module.exports = {
    check_user,
    remove_role,
    set_role,
    check_role,
    send_set_role_msg,
    send_remove_role_msg
};