const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bot_methods = require('./bot');
const logger = require('./logger')
const expressWinston = require('express-winston');
const port = 8080;
const db_tools = require('./db_tools');


app.use((req, res, next) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/api/user/getUser', async (req, res) => {
    if (Object.keys(req.body).length) {
        let user = db_tools.getDBUser(req.body);
        if (user) {
            if (await bot_methods.check_role(user.user, user.discriminator)) {
                res.status(200).send(db_tools.getDBUser(req.body));
            } else {
                db_tools.removeRoleDBUser(req.body);
                res.status(400).send({
                    message: 'Not verify',
                    data: db_tools.getDBUser(req.body)
                });
            }
        } else {
            res.status(401).send({
                message: 'Not in db'
            });
        }
    } else {
        res.status(402).send({
            message: 'Body is empty'
        });
    }
})

app.post('/api/user/addRole', async (req, res) => {
    if (Object.keys(req.body).length) {
        if (req.body.user && req.body.principal) {
            if (db_tools.hasDBUser(req.body.user, req.body.discriminator)) {
                res.status(403).send({
                    message: 'User already registered!'
                });
            } else {
                db_tools.writeDBUser(req.body);
                if (await bot_methods.check_user(req.body.user, req.body.discriminator)) {
                    if (!await bot_methods.check_role(req.body.user, req.body.discriminator)) {
                        await bot_methods.set_role(req.body.user, req.body.discriminator);
                        db_tools.writeStatusDBUser(req.body);
                        res.status(200).send(db_tools.getDBUser(req.body));
                    } else {
                        db_tools.writeStatusDBUser(req.body);
                        res.status(400).send({
                            message: 'User has a role!',
                            data: db_tools.getDBUser(req.body)
                        });
                    }
                } else {
                    res.status(402).send({
                        message: 'User not in chanel'
                    });
                }
            }
        } else {
            res.status(405).send({
                message: 'Name is empty'
            });
        }
    } else {
        res.status(405).send({
            message: 'Body is empty'
        });
    }
})

app.post('/api/user/removeRole', async (req, res) => {
    if (Object.keys(req.body).length) {
        if (req.body.user) {
            if (await bot_methods.check_role(req.body.user, req.body.discriminator)) {
                await bot_methods.remove_role(req.body.user, req.body.discriminator);
                db_tools.removeRoleDBUser(req.body);
                res.status(202).send();
            } else {
                res.status(402).send({
                    message: 'User has role'
                });
            }
        } else {
            res.status(400).send({
                message: 'Name is empty'
            });
        }
    } else {
        res.status(400).send({
            message: 'Body is empty'
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})