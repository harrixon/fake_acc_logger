
class AuthRouter {
    constructor(express, authServices, knex, jwtAuth){
        this.express = express;
        this.authServices = authServices;
        this.knex = knex;
        this.jwtAuth = jwtAuth;
    }

    router(){
        const router = this.express.Router();

        router.post("/login", this.login.bind(this));

        return router;
    }

    async login(req, res){
        return this.authServices
            .login(req)
            .then(result => {
                if (result.success) {
                    res.status(200).json({token: result.token});
                } else {
                    res.status(401).json({err: "invalid input"});
                }
            })
            .catch(err => {
                res.status(500).json({err});
            });
    }
}

module.exports = AuthRouter;