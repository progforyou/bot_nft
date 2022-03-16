const fs = require('fs');
const config = require('dotenv').config().parsed || process.env;


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
        "url": config.DATABASE_URL,
        "use_env_variable": "DATABASE_URL",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
}