const Promise = require("bluebird");

const cryptoRandomString = require('crypto-random-string');

const sample = {
    serviceProvider: "origin",
    loginType: "Google",
    email: "sample@gmail.com",
    username: "sample",
    remark: "",
    URL: ""
}

class AccountServices {
    constructor(knex) {
        this.knex = knex;
    }

    async getListOfAllAccounts(UID) {
        // get list of all service providers
        try {
            if (
                UID === ""
                || UID === undefined
                || UID === null
            ) {
                throw new Error("missing UID");
            } else {
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
        }
        catch (err) {
            if (err.message === "missing UID") {
                throw err;
            } else {
                console.log("services: ", err);
                throw new Error(err);
            }
        }
    }

    async getByServiceProvider(req) {
        let query = req.query;
        let UID = req.user.UID;
        try {
            // check request integrity
            if (
                query === ""
                || query === undefined
                || query === null
                || typeof (query.serviceProvider) !== "string"
                || query.serviceProvider === ""
                || query.serviceProvider === undefined
                || query.serviceProvider === null
            ) {
                throw new Error("invalid query");
            } else if (
                UID === ""
                || UID === undefined
                || UID === null
            ) {
                throw new Error("missing UID");
            } else {
                return this.knex("doppelganger")
                    .where({
                        isActive: true,
                        ownerUID: UID,
                        serviceProvider: query.serviceProvider.toUpperCase(),
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
        }
        catch (err) {
            if (
                err.message === "invalid query"
                || err.message === "missing UID"
            ) {
                throw (err);
            } else {
                console.log("service:", err);
                throw new Error(err);
            }
        }
    }

    async getByEmailServiceProvider(req) {
        let query = req.query;
        let UID = req.user.UID;
        try {
            // check request integrity
            if (
                query === ""
                || query === undefined
                || query === null
                || typeof (query.emailServiceProvider) !== "string"
                || query.emailServiceProvider === ""
                || query.emailServiceProvider === undefined
                || query.emailServiceProvider === null
            ) {
                throw new Error("invalid query");
            } else if (
                UID === ""
                || UID === undefined
                || UID === null
            ) {
                throw new Error("missing UID");
            } else {
                return this.knex("doppelganger")
                    .where({
                        isActive: true,
                        ownerUID: UID,
                        emailServiceProvider: query.emailServiceProvider.toUpperCase(),
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
        }
        catch (err) {
            if (
                err.message === "invalid query"
                || err.message === "missing UID"
            ) {
                throw (err);
            } else {
                console.log("service:", err);
                throw new Error(err);
            }
        }
    }

    async addAccount(req) {
        let actionInfo = req.body;
        let UID = req.user.UID;

        try {
            // check request integrity
            if (
                actionInfo.type !== "ADD"
                || actionInfo.serviceProvider === ("" || undefined || null)
                || actionInfo.loginType === ("" || undefined || null)
                || actionInfo.username === ("" || undefined || null)
                || actionInfo.password === ("" || undefined || null)
            ) {
                throw new Error("bad package");
            } else if (
                UID === ""
                || UID === undefined
                || UID === null
            ) {
                throw new Error("missing UID");
            }
            else {
                let alreadyExist =
                    await this.knex("doppelganger")
                        .where({
                            serviceProvider: actionInfo.serviceProvider.toUpperCase(),
                            username: actionInfo.username,
                        })
                        .select("accID");

                if (alreadyExist.length !== 0) {
                    throw new Error("account already exist");
                }
                else {
                    let accIDList = await this.knex("doppelganger").select("accID");
                    let accID = this.genAccID(accIDList);

                    return this.knex("doppelganger")
                        .insert({
                            ownerUID: UID,
                            accID: accID,
                            serviceProvider: actionInfo.serviceProvider.toUpperCase(),
                            loginType: actionInfo.loginType.toUpperCase(),
                            username: actionInfo.username,
                            email: actionInfo.email,
                            emailServiceProvider: actionInfo.emailServiceProvider.toUpperCase(),
                            password: actionInfo.password,
                            remark: actionInfo.remark,
                            URL: actionInfo.URL,
                            isActive: true,
                        })
                        .returning("accID")
                }
            }
        }
        catch (err) {
            if (
                err.message === "bad package"
                || err.message === "missing UID"
                || err.message === "account already exist"
            ) {
                throw (err);
            } else {
                console.log("service:", err);
                throw new Error(err);
            }
        }
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

    async deactivateAccount(req) {
        let actionInfo = req.body;
        let UID = req.user.UID;

        try {
            // check request integrity
            if (
                actionInfo.type !== "DEACTIVATE"
                || actionInfo.accID === ("" || undefined || null)
            ) {
                throw new Error("bad package");
            } else if (
                UID === ""
                || UID === undefined
                || UID === null
            ) {
                throw new Error("missing UID");
            }
            else {
                let result = await this.knex("doppelganger")
                    .where({
                        ownerUID: UID,
                        accID: actionInfo.accID,
                    }).update({
                        isActive: false
                    });
                if (result === 1) {
                    // updated
                    return result;
                } else {
                    // nth done
                    throw new Error("account does not exist");
                }
            }
        }
        catch (err) {
            if (
                err.message === "bad package"
                || err.message === "missing UID"
                || err.message === "account does not exist"
            ) {
                throw (err);
            } else {
                console.log("service:", err);
                throw new Error(err);
            }
        }
    }

    genAccID(accIDList) {
        let accID = cryptoRandomString(10);
        let found = accIDList.find(a => {
            return a.UID === accID;
        });
        if (found) {
            this.genAccID(accIDList);
        } else {
            return accID;
        }
    }

}

module.exports = AccountServices;
