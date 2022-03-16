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
        "url": process.env.DATABASE_URL,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
}