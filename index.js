const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bot_methods = require('./bot');
const logger = require('./logger')
const expressWinston = require('express-winston');
const port = process.env.PORT || 8080;
const db_tools = require('./db_tools');
const checker = require('./nft_check');
const cors = require('cors')

checker.init();

const corsOptions = {
  origin: 'https://icpets.xyz/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log('origin', req.get('origin'));
    console.log('hostname', req.hostname)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/api/user/getUser', async (req, res) => {
        if (req.body.principal) {
            let user_data = db_tools.getDBUser(req.body);
            if (user_data) {
                if (await bot_methods.check_role(user_data.user.name, user_data.user.discriminator)) {
                    res.status(200).send(db_tools.getDBUser(req.body));
                } else {
                    db_tools.removeRoleDBUser(req.body);
                    res.status(400).send({
                        message: 'Not verify'
                    });
                }
            } else {
                res.status(400).send({
                    message: 'Not verify'
                });
            }
        } else {
            res.status(402).send({
                message: 'Unable principal'
            });
        }
    }
)

app.post('/api/user/addRole', async (req, res) => {
    if (Object.keys(req.body).length) {
        if (req.body.user) {
            if (db_tools.hasDBUser(req.body.user, req.body.discriminator)) {
                res.status(403).send({
                    message: 'User already registered!'
                });
            } else if (db_tools.hasByPrincipalDBUser(req.body.principal)) {
                res.status(403).send({
                    message: `User already registered by ${db_tools.hasByPrincipalDBUser(req.body.principal).user.name}!`
                });
            } else {
                if (await bot_methods.check_user(req.body.user, req.body.discriminator)) {
                    try {
                        await bot_methods.set_role(req.body.user, req.body.discriminator);
                        db_tools.writeDBs(req.body);
                        res.status(200).send(db_tools.getDBUser(req.body));
                    } catch (e) {
                        console.log(e.toString());
                        res.status(402).send({
                            message: 'Missing permission!'
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
    if (req.body.user) {
        if (await bot_methods.check_role(req.body.user, req.body.discriminator)) {
            await bot_methods.remove_role(req.body.user, req.body.discriminator);
            db_tools.removeRoleDBUser(req.body);
            res.status(202).send();
        } else {
            res.status(402).send({
                message: 'User has not a role'
            });
        }
    } else {
        res.status(400).send({
            message: 'Name is empty'
        });
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})