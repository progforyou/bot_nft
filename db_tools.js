const fs = require('fs');
let user_db = require('./users.json');
let addresses_db = require('./addresses.json');
const user_db_name = "users.json";
const addresses_db_name = "addresses.json";
const _ = require('lodash');


const getDBUser = (data) => {
    return user_db[data.principal]
}

const removeRoleDBUser = (data) => {
    let user = user_db[data.principal];
    delete addresses_db[user.addresses];
    delete user_db[data.principal]; 
    writeFile(user_db, user_db_name);
    writeFile(addresses_db, addresses_db_name);
}


const writeDBs = (data) => {
    let addresses_db_id = Object.keys(addresses_db).length;
    user_db[data.principal] = {
        user: {name: data.user, discriminator: data.discriminator},
        addresses: addresses_db_id
    };
    addresses_db[addresses_db_id] = data.addresses;
    writeFile(user_db, user_db_name);
    writeFile(addresses_db, addresses_db_name);
}

const writeFile = (file, fileName) => {
    fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(file));
    });
}

const hasDBUser = (name, discriminator) => {
    let res = false;
    _.map(user_db, (value, key) => {
        if (discriminator.length) {
            if (value.user.name === name && value.user.discriminator === discriminator) res = true
        } else {
            if (value.user.name === name) res = true;
        }
    })
    return res;
}

const hasByPrincipalDBUser = (principal) => {
    return user_db[principal];
}

module.exports = {
    writeDBs,
    getDBUser,
    removeRoleDBUser,
    hasDBUser,
    hasByPrincipalDBUser
}
