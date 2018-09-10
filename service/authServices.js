const Promise = require("bluebird");

const bcrypt = require("bcryptjs");
const config = require("./../jwtConfig");
const jwtSimple = require("jwt-simple");

class AuthServices {
    constructor(knex) {
        this.knex = knex;
    }

    async login(req) {
        try {
            if (req.body.username && req.body.password) {
                var username = req.body.username;
                var password = req.body.password;

                var findUser =
                    await this.knex("systemUsers")
                        .where({ username })
                        .select("id", "UID", "username", "password");

                var isFound = (findUser.length != 0);
                var validPassword = isFound ? await bcrypt.compareSync(password, findUser[0].password) : false;

                if (isFound && validPassword) {
                    var payload = {
                        UID: findUser[0].UID,
                        password: password
                    };
                    var token = await jwtSimple.encode(payload, config.jwtSecret);
                    return ({ success: true, token: token });
                } else {
                    return ({ success: false, token: "" });
                }
            } else {
                return ({ success: false, token: "" });
            };
        }
        catch (err) {
            console.log("service Error: ", err);
        }
    }
}

module.exports = AuthServices;