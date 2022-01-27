const fs = require('fs');
const fileName = './users.json';
let file = require('./users.json');


const getDBUser = (data) => {
    return file[data.principal]
}

const removeRoleDBUser = (data) => {
    file[data.principal] = {...file[data.principal], status: false};
    writeFile(file);
}


const writeDBUser = (data) => {
    file[data.principal] = {user: data.user, discriminator: data.discriminator, status: false};
    writeFile(file);
}

const writeStatusDBUser = (data) => {
    file[data.principal] = {...file[data.principal], status: true};
    writeFile(file);
}

const writeFile = (file) => {
    fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(file));
    });
}

module.exports = {
    writeDBUser,
    writeStatusDBUser,
    getDBUser,
    removeRoleDBUser
}
