// import all sub-router here
const AuthRouter = require("./authRouter");
const ServiceRouter = require("./serviceRouter");

class ApiRouter {
    constructor(jwtAuth, express, authServices, accountServices, knex){
        this.jwtAuth = jwtAuth;
        this.express = express;
        this.authServices = authServices;
        this.accountServices = accountServices;
        this.knex = knex;
    }
    
    router(){
        const router = this.express.Router();
        const authRouter = new AuthRouter(this.express, this.authServices, this.knex, this.jwtAuth);
        const serviceRouter = new ServiceRouter(this.express, this.accountServices, this.knex);

        router.use("/auth", authRouter.router());
        router.use("/service", this.jwtAuth.authenticate(), serviceRouter.router());

        return router;
    }
}

module.exports = ApiRouter;
