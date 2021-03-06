/*
    shall add regex check on email and ID input
*/

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
            if (this.missingUID(UID)) {
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
                typeof (query) !== "object"
                || typeof (query.serviceProvider) !== "string"
                || query.serviceProvider.trim() === ""
            ) {
                throw new Error("invalid query");
            } else if (this.missingUID(UID)) {
                throw new Error("missing UID");
            } else {
                let result = await this.knex("doppelganger")
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
                    );
                if (result.length === 0) {
                    // result = []
                    return ("not_found");
                } else {
                    return result;
                }
            }
        }
        catch (err) {
            if (
                err.message === "invalid query" || "missing UID"
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
                typeof (query) !== "object"
                || typeof (query.emailServiceProvider) !== "string"
                || query.emailServiceProvider.trim() === ""
            ) {
                throw new Error("invalid query");
            } else if (this.missingUID(UID)) {
                throw new Error("missing UID");
            } else {
                let result = await this.knex("doppelganger")
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
                    console.log(result)
                if (result.length === 0) {
                    return ("not_found");
                } else {
                    return result;
                }
            }
        }
        catch (err) {
            if (
                err.message === "invalid query" || "missing UID"
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
                || typeof (actionInfo.serviceProvider) !== "string"
                || actionInfo.serviceProvider.trim() === ""
                || !(actionInfo.loginType === "LOCAL" || actionInfo.loginType === "SOCIAL")
            ) {
                throw new Error("bad package");
            } else if (
                actionInfo.loginType === "LOCAL"
                && (
                    typeof (actionInfo.username) !== "string"
                    || actionInfo.username.trim() === ""
                    || typeof (actionInfo.password) !== "string"
                    || actionInfo.password.trim() === ""
                )
            ) {
                throw new Error("bad package");
            } else if (
                actionInfo.loginType === "SOCIAL"
                && (
                    typeof (actionInfo.email) !== "string"
                    || actionInfo.email.trim() === ""
                    || typeof (actionInfo.emailServiceProvider) !== "string"
                    || actionInfo.emailServiceProvider.trim() === ""
                )
            ) {
                throw new Error("bad package");
            } else if (this.missingUID(UID)) {
                throw new Error("missing UID");
            } else {
                let line =
                    await this.knex("doppelganger")
                        .where({
                            isActive: true,
                            ownerUID: UID,
                            serviceProvider: actionInfo.serviceProvider.toUpperCase(),
                            username: actionInfo.username,
                            loginType: actionInfo.loginType,
                        })
                        .select("accID");

                console.log("EXIST:", line);

                if (line.length !== 0) {
                    throw new Error("account already exist");
                } else {
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
                err.message === "bad package" || "missing UID" || "account already exist"
            ) {
                // console.log(err.message)
                throw (err);
            } else {
                console.log("service:", err);
                throw new Error(err);
            }
        }
    }

    async updateAccount(req) {
        let actionInfo = req.body;
        let UID = req.user.UID;

        try {
            if (
                actionInfo.type !== "UPDATE"
                || typeof (actionInfo.accID) !== "string"
                || actionInfo.accID.trim() === ""
            ) {
                throw new Error("bad package");
            } else if (this.invalidUpdateDetails(actionInfo.details)) {
                throw new Error("invalid update details");
            } else if (this.missingUID(UID)) {
                throw new Error("missing UID");
            } else {
                let accExist = await this.accExist(UID, actionInfo.accID);
                if (!accExist) {
                    throw new Error("account does not exist");
                } else {
                    let cleanPackage = this.sanitizeUpdateDetails(actionInfo.details);
                    return this.knex("doppelganger")
                        .where({
                            ownerUID: UID,
                            accID: actionInfo.accID
                        })
                        .update(cleanPackage);
                }
            }
        }
        catch (err) {
            if (
                err.message === "bad package"
                || "invalid update details"
                || "account does not exist"
                || "missing UID"
            ) {
                // console.log(err.message)
                throw (err);
            } else {
                console.log("service:", err);
                throw new Error(err);
            }
        }
    }

    async deactivateAccount(req) {
        let actionInfo = req.body;
        let UID = req.user.UID;

        try {
            // check request integrity
            if (
                actionInfo.type !== "DEACTIVATE"
                || typeof (actionInfo.accID) !== "string"
                || actionInfo.accID.trim() === ""
            ) {
                throw new Error("bad package");
            } else if (this.missingUID(UID)) {
                throw new Error("missing UID");
            } else {
                //                                                      vvv include in-active
                let accExist = await this.accExist(UID, actionInfo.accID, true);
                if (!accExist) {
                    throw new Error("account does not exist");
                } else {
                    // will return 1 if successfully overwritten
                    // does not matter if content is not actually changed
                    return await this.knex("doppelganger")
                        .where({
                            ownerUID: UID,
                            accID: actionInfo.accID,
                        }).update({
                            isActive: false
                        });
                }
            }
        }
        catch (err) {
            if (
                err.message === "bad package"
                || "missing UID"
                || "account does not exist"
            ) {
                console.log(err.message)
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

    missingUID(UID) {
        return (typeof (UID) !== "string" || UID.trim() === "");
    }

    async accExist(UID, accID, includeInActive = false) {
        let accIDList = [];
        if (includeInActive) {
            accIDList = await this.knex("doppelganger")
            .where({
                ownerUID: UID,
            })
            .select("accID");
        } else {
            accIDList = await this.knex("doppelganger")
                .where({
                    isActive: true,
                    ownerUID: UID,
                })
                .select("accID");
        }
        return accIDList.find(a => (a.accID === accID));
    }

    invalidUpdateDetails(details) {
        // check all input are strings
        const allowed = new Set(["loginType", "username", "email", "password", "remark", "URL"]);
        let keys = Object.getOwnPropertyNames(details);
        keys.forEach(k => {
            if (!allowed.has(k)) {
                return true;
            }
        });
        // check if switching login-type
        if (typeof (details.loginType) === "string") {
            if (details.loginType === "LOCAL") {
                if (
                    details.username.trim() === ""
                    || details.password.trim() === ""
                ) {
                    return true;
                }
            } else if (details.loginType === "SOCIAL") {
                if (
                    details.email.trim() === ""
                    || details.emailServiceProvider.trim() === ""
                    // add regex check for email later
                ) {
                    return true;
                }
            } else {
                // invalid login-type
                return true;
            }
        }
        return false;
    }

    sanitizeUpdateDetails(details) {
        let pkg = {};
        // allowed, might not be necessary
        const allowed = new Set(["loginType", "username", "email", "password", "remark", "URL"]);
        let keys = Object.getOwnPropertyNames(details);
        keys.forEach(k => {
            if (allowed.has(k)) {
                pkg[k] = details[k];
            }
        });
        return pkg;
    }
}

module.exports = AccountServices;
