const fs = require('fs');

module.exports = {
    "development": {
        "username": "nikolay",
        "password": "57k21x174",
        "database": "ntf_bot",
        "host": "localhost",
        "dialect": "postgres"
    },
    "test": {
        "username": "nikolay",
        "password": "57k21x174",
        "database": "ntf_bot",
        "host": "localhost",
        "dialect": "postgres"
    },
    "production": {
        "url": "postgres://xyzclgezunwhtt:b4abc4eeeffcc392c9586dad861fb46ba197bf94cf7f13b6de4ba373d3cce60e@ec2-52-208-221-89.eu-west-1.compute.amazonaws.com:5432/d56u8mvuqh4dg2",
        "use_env_variable": "postgres://xyzclgezunwhtt:b4abc4eeeffcc392c9586dad861fb46ba197bf94cf7f13b6de4ba373d3cce60e@ec2-52-208-221-89.eu-west-1.compute.amazonaws.com:5432/d56u8mvuqh4dg2",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: true
            }
        }
    }
}