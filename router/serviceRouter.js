class ServiceRouter {
    constructor(express, accountServices, knex){
        this.express = express;
        this.accountServices = accountServices;
        this.knex = knex;
    }

    router(){
        const router = this.express.Router();
        // get all acc info by token(UID)
        router.get("/accList", this.getListOfAllAccounts.bind(this));
        // give provider's name, get acc info
        router.get("/byServiceProvider", this.getByServiceProvider.bind(this));
        router.get("/byEmailProvider", this.getByEmailProvider.bind(this));
        // add/update/delete acc info
        router.post("/newAcc", this.addAccount.bind(this));
        router.post("/updateAcc", this.updateAccount.bind(this));
        router.post("/delAcc", this.deleteAccount.bind(this));

        return router;
    }

    getListOfAllAccounts(req, res){
        return this.accountServices
            .getListOfAllAccounts(req.user.UID)
            .then(resultPkg => {
                res.status(201).json({resultPkg});
            })
            .catch(err => {
                res.status(500).json(err);
            });
    }

    async getByServiceProvider(req, res){
        return this.accountServices
            .getByServiceProvider(req.query)
            .then(resultPkg => {
                res.status(201).json({resultPkg});
            })
            .catch(err => {
                res.status(500).json({status: err});
            });
    }

    async getByEmailProvider(req, res) {
        return this.accountServices
            .getByEmailProvider(req.param.emailProvider)
            .then(resultPkg => {
                res.status(201).json({resultPkg});
            })
            .catch(err => {
                res.status(500).json({status: err});
            });
    }

    async addAccount(req, res){
        return this.accountServices
            .addAccount(req.body.actionInfo)
            .then(resultPkg => {
                res.status(201).json({resultPkg});
            })
            .catch(err => {
                res.status(500).json({status: err});
            });
    }

    async updateAccount(req, res){
        return this.accountServices
            .updateAccount(req.body.actionInfo)
            .then(resultPkg => {
                res.status(201).json({resultPkg});
            })
            .catch(err => {
                res.status(500).json({status: err});
            });
    }

    async deleteAccount(req, res){
        return this.accountServices
            .deleteAccount(req.body.actionInfo)
            .then(resultPkg => {
                res.status(201).json({resultPkg});
            })
            .catch(err => {
                res.status(500).json({status: err});
            });
    }
}

module.exports = ServiceRouter;