const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    jwtSecret: process.env.jwtSecret,
    jwtSession: {
        session: false
    }
}