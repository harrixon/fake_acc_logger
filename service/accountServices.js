const Promise = require("bluebird");

const sample = {
    serviceProvider:"origin",
    loginType:"Google",
    email:"sample@gmail.com",
    username:"sample",
    remark:"",
    URL:""
}

class AccountServices {
    constructor(knex) {
        this.knex = knex;
    }

    async getListOfAllAccounts(UID) {
        // get list of all service providers
        try {
            return this.knex("doppelganger")
                .where({
                    isActive: true,
                    ownerUID: UID,
                })
                .select(
                    "id", 
                    "ownerUID", 
                    "accID",
                    "serviceProvider",
                    "loginType",
                    "username",
                    "email",
                    "emailServiceProvider",
                    "password",
                    "remark",
                    "URL",
                );
        }
        catch (err) {
            console.log("services: ", err);
            throw new Error (err);
        }
    }

    async getByServiceProvider(query) {
        try {
            return this.knex("doppelganger")
                .where({
                    isActive: true,
                    serviceProvider: query.serviceProvider,
                })
                .select(
                    "id", 
                    "ownerUID", 
                    "accID",
                    "serviceProvider",
                    "loginType",
                    "username",
                    "email",
                    "emailServiceProvider",
                    "password",
                    "remark",
                    "URL",
                )
        }
        catch (err) {
            console.log("services: ", err);
            throw new Error (err);
        }
    }

    async getByEmailServiceProvider(query) {
        try {
            return this.knex("doppelganger")
                .where({
                    isActive: true,
                    emailServiceProvider: query.emailServiceProvider,
                })
                .select(
                    "id", 
                    "ownerUID", 
                    "accID",
                    "serviceProvider",
                    "loginType",
                    "username",
                    "email",
                    "emailServiceProvider",
                    "password",
                    "remark",
                    "URL",
                );
        }
        catch (err) {
            console.log("services: ", err);
            throw new Error (err);
        }
    }

    async addAccount(actionInfo) {
        // add new acc to DB
        // action type : add new account
        // require : service provider, login-type, username &| email, password
        // input validation
        return new Promise((resolve, reject) => {
            resolve(sample);
        });
    }

    async updateAccount(actionInfo) {
        // update acc info
        // action type : update existing account
        // require : service provider, login-type, username &| email
        // input validation
        return new Promise((resolve, reject) => {
            resolve(sample);
        });
    }

    async deleteAccount(actionInfo) {
        // del acc info
        // action type : delete existing account
        // require : service provider, login-type, username &| email
        // input validation
        return new Promise((resolve, reject) => {
            resolve(sample);
        });
    }
}

module.exports = AccountServices;
