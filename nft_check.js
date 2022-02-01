const cross_fetch = require("cross-fetch");
const idlFactory = require('./Factories/ext.did');
const {HttpAgent, Actor} = require("@dfinity/agent");
const collections = require('./collections.json').collections;

const addresses_db = require('./addresses.json');
const user_db = require('./users.json');
const _ = require('lodash');
const bot_methods = require('./bot');
const db_tools = require("./db_tools");

const timeOut = 5; //Время в минутах


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
    await Promise.all(_.map(user_db, async (value, key) => {
        let count = 0;
        let addresses = addresses_db[value.addresses];
        await Promise.all(addresses.map(async (address) => {
            return await Promise.all(collections.map(async token => {
                let data = await checkNFT(address, token);
                if (data.ok){
                    count += data.ok.length;
                }
                console.log(data);
            }))
        }))
        if (count === 0){
            await bot_methods.remove_role(value.user.name, value.user.discriminator);
            db_tools.removeRoleDBUser({principal: key});
        }
    }))
}

const init = () => {
    setInterval(checkAllUsersNFT, 1 * 10000);
}


module.exports = {
    init
}