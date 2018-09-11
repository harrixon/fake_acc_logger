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

    async getListOfAllAccounts() {
        // get list of all service providers
        return new Promise((resolve, reject) => {
            resolve(sample);
        });
    }

    async getByServiceProvider(info) {
        // fetch acc info by provider's name
        // input validation
        // let serviceProvider = info.serviceProvider.toLowerCase();
        return new Promise((resolve, reject) => {
            resolve(sample);
        });
    }

    async getByEmailProvider(info) {
        // fetch acc info by giving email provider
        // input validation
        // let emailProvider = info.emailProvider.toLowerCase();
        return new Promise((resolve, reject) => {
            resolve(sample);
        });
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

// interface IActionInfo {
//     type: "ADD" | "UPDATE" | "DELETE",
//     serviceProvider: string,
//     loginType: "LOCAL" | emailServiceProvider,
//     username?: string,
//     email?: string,
//     password: string,
//     remark?: string,
//     URL?: string,
//     update?: IUpdateInfo,
// }

// interface IUpdateInfo {
//     newLoginType: "LOCAL" | emailServiceProvider,
//     newUsername?: string,
//     newEmail?: string,
//     newPassword?: string,
//     newRemark?: string,
//     newURL?: string,
// }
