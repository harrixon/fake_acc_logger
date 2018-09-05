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
    

    // async chooseService() {
        // const schema = {
        //     properties: {
        //         service: {
        //             description: "Choose a function",
        //             type: 'string',
        //             pattern: /^[1-4]$/,
        //             message: 'Choose a valid number',
        //             required: true
        //         }
        //     }
        // }
    // }

    // async addLine() {
        // const schema_input = {
        //     properties: {
        //         provider: {
        //             description: "Service you registered to",
        //             type: 'string',
        //             pattern: /^[0-9a-zA-Z\s\-\.]+$/,
        //             message: 'Name must be only letters, spaces, dashes or dots',
        //             required: true
        //         },
        //         login_type : {
        //             description: "Local-login (1) | FB (2) | Google (3)",
        //             type: 'string',
        //             pattern: /^[1-3]$/,
        //             message: "Choose a valid number",
        //             required: true
        //         },
        //         username: {
        //             description: "username of local login / email username for social login",
        //             type: 'string',
        //             pattern: /^[0-9a-zA-Z\-]+$/,
        //             message: 'Name must be only letters, or dashes',
        //             required: true
        //         }
        //     }
        // }
        // const schema_pw = {
        //     properties: {
        //         password: {
        //             description: 'Enter your password',
        //             type: 'string',
        //             hidden: true,
        //             required: true
        //         }
        //     }
        // }
        // const schema_confirm = {
        //     properties: {
        //         confirmation: {
        //             description: "CONFIRM(1) , DISCARD(2)",
        //             type: 'string',
        //             pattern: /^[1-2]$/,
        //             message: 'Choose a valid number',
        //             required: true
        //         }
        //     }
        // }
        // console.log("\nAdd new entry \n");        
    // }

    // lookUpLine() {
        // const schema_check = {
        //     properties: {
        //         check: {
        //             description: "Choose a service",
        //             type: 'string',
        //             pattern: /^[1-3]$/,
        //             message: 'Choose a valid number',
        //             required: true
        //         },
        //     }
        // }
        // const schema_by_service = {
        //     properties: {
        //         provider: {
        //             description: "Enter service provider's name",
        //             type: 'string',
        //             pattern: /^[0-9a-zA-Z\s\-\.]+$/,
        //             message: 'Name must be only letters, spaces, dashes or dots',
        //             required: true
        //         }
        //     }
        // }
        // console.log("\nLook up by SERVICE NAME(1) | FB(2) | Google(3) \n");
    // }    
