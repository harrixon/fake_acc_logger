class ServiceRouter {
    constructor(express, accountServices, knex) {
        this.express = express;
        this.accountServices = accountServices;
        this.knex = knex;
    }

    router() {
        const router = this.express.Router();
        // get all acc info by token(UID)
        router.get("/accList", this.getListOfAllAccounts.bind(this));
        // give provider's name, get acc info
        router.get("/byServiceProvider", this.getByServiceProvider.bind(this));
        router.get("/byEmailServiceProvider", this.getByEmailServiceProvider.bind(this));
        // add/update/delete acc info
        router.post("/newAcc", this.addAccount.bind(this));
        router.post("/updateAcc", this.updateAccount.bind(this));
        router.post("/deactivateAcc", this.deactivateAccount.bind(this));

        return router;
    }

    getListOfAllAccounts(req, res) {
        return this.accountServices
            .getListOfAllAccounts(req.user.UID)
            .then(resultPkg => {
                res.status(200).json({ resultPkg });
            })
            .catch(err => {
                if (err.message === "missing UID") {
                    res.status(400).send("missing UID");    
                } else {
                    res.status(500).send(err);
                }
            });
    }

    async getByServiceProvider(req, res) {
        return this.accountServices
            .getByServiceProvider(req)
            .then(resultPkg => {
                res.status(200).json({ resultPkg });
            })
            .catch(err => {
                if (err.message === "invalid query") {
                    res.status(400).send("invalid query");
                } else if (err.message === "missing UID") {
                    res.status(400).send("missing UID");
                } else {
                    res.status(500).send(err);
                }
            });
    }

    async getByEmailServiceProvider(req, res) {
        return this.accountServices
            .getByEmailServiceProvider(req)
            .then(resultPkg => {
                res.status(200).json({ resultPkg });
            })
            .catch(err => {
                if (err.message === "invalid query") {
                    res.status(400).send("invalid query");
                } else if (err.message === "missing UID") {
                    res.status(400).send("missing UID");
                } else {
                    res.status(500).send(err);
                }
            });
    }

    async addAccount(req, res) {
        return this.accountServices
            .addAccount(req)
            .then(resultPkg => {
                res.status(200).json({ resultPkg });
            })
            .catch(err => {
                if (err.message === "bad package" || "account already exist") {
                    res.status(400).send(err.message);
                } else if (err.message === "missing UID") {
                    res.status(400).send("missing UID");
                } else {
                    res.status(500).send(err.message);
                }
            });
    }

    async updateAccount(req, res) {
        return this.accountServices
            .updateAccount(req)
            .then(resultPkg => {
                res.status(200).json({ resultPkg });
            })
            .catch(err => {
                if (err.message === "bad package" || "account does not exist" || "invalid update details") {
                    res.status(400).send(err.message);
                } else if (err.message === "missing UID") {
                    res.status(400).send("missing UID");
                } else {
                    res.status(500).send(err.message);
                }
            });
    }

    async deactivateAccount(req, res) {
        return this.accountServices
            .deactivateAccount(req)
            .then(resultPkg => {
                res.status(200).json({ resultPkg });
            })
            .catch(err => {
                if (err.message === "bad package" || "account does not exist") {
                    res.status(400).send(err.message);
                } else if (err.message === "missing UID") {
                    res.status(400).send("missing UID");
                } else {
                    res.status(500).send(err.message);
                }
            });
    }
}

module.exports = ServiceRouter;