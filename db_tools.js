const fs = require('fs');
let user_db = require('./users.json');
let addresses_db = require('./addresses.json');
const path = require('path');
const user_db_name = path.resolve(__dirname, "users.json");
const addresses_db_name = path.resolve(__dirname, "addresses.json");
const _ = require('lodash');
const db = require('./models/index.js');

/*db.Users.create({ name: "batthyaniy", discriminator: "0239", principal: "or7v4-foyui-md4el-nup5g-gnboi-vz6ct-dwzrj-3irhi-rw6fm-m5d7v-7qe" });*/
const getDBUser = async (data) => {
    console.log(await db.Users.findAll());
    console.log(await db.Addresses.findAll());
    let row = await db.Users.findOne({where: {principal: data.principal}});
    if (row) return row.dataValues;
}
/*db.Addresses.create({userId: 1, address: "addressqweqweqwe"})*/
/*return db.User.findAll();*/

const removeRoleDBUser = async (data) => {
    let user = await getDBUser(data);
    await db.Users.destroy({
        where: {
            principal: data.principal
        }
    });
    await db.Addresses.destroy({
        where: {
            userId: user.id
        }
    });

}


const writeDBs = async (data) => {
    await db.Users.create({name: data.user, discriminator: data.discriminator, principal: data.principal});
    let user = await getDBUser(data);
    data.addresses.map(e => {
        db.Addresses.create({address: e, userId: user.id});
    })
}

const hasDBUser = async (name, discriminator) => {
    let row;
    if (discriminator.length) {
        row = await db.Users.findOne({where: {name: name, discriminator: discriminator}});
    } else {
        row = await db.Users.findOne({where: {name: name}});
    }
    return !!row;
}

const getAllUsers = async () => {
    return await db.Users.findAll();
}

const getAddressesByUser = async (id) => {
    return await db.Addresses.findAll({
        where: {
            userId: id
        }
    });
}

module.exports = {
    writeDBs,
    getDBUser,
    removeRoleDBUser,
    hasDBUser,
    getAllUsers,
    getAddressesByUser
}
