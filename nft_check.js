const cross_fetch = require("cross-fetch");
const idlFactory = require('./Factories/ext.did');
const {HttpAgent, Actor} = require("@dfinity/agent");
const collections = require('./collections.json').collections;

const _ = require('lodash');
const bot_methods = require('./bot');
const db_tools = require("./db_tools");

const timeOut = 15; //Время в минутах


const checkNFT = async (address, collection) => {
    const agent = createAgent();
    let actor = createActor(agent, collection);
    return actor.tokens(address);
}

const createAgent = () => {
    return new HttpAgent({
        host: 'https://raw.ic0.app',
        fetch: cross_fetch.default
    });
}

const createActor = (agent, collection) => {
    return Actor.createActor(idlFactory, {
        agent,
        canisterId: collection.canisterId
    })
}

const checkAllUsersNFT = async () => {
    let users = await db_tools.getAllUsers();
    await Promise.all(_.map(users, async value => {
        let count = 0;
        let addresses = await db_tools.getAddressesByUser(value.dataValues.id);
        await Promise.all(addresses.map(async (address) => {
            return await Promise.all(collections.map(async token => {
                let data = await checkNFT(address.dataValues.address, token);
                if (data.ok){
                    count += data.ok.length;
                }
                console.log(data);
            }))
        }))
        if (count === 0){
            await bot_methods.remove_role(value.dataValues.name, value.dataValues.discriminator);
            await db_tools.removeRoleDBUser({principal: value.dataValues.principal});
        }
    }))
}

const init = () => {
    setInterval(checkAllUsersNFT, timeOut * 60000);
}


module.exports = {
    init
}