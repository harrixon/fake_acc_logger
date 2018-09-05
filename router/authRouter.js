const users = [
    {
        id: 1,
        username: "username",
        password: "password"
    }
]

const config = require("./../config");
const jwtSimple = require ("jwt-simple");

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
        if (req.body.username && req.body.password) {
            var username = req.body.username;
            var password = req.body.password;
            var user = users.find((u)=> {
                return u.username === username && u.password === password;
            });
            // use authService to check DB for user data
            if (user) {
                var payload = {
                    id: user.id
                };
                var token = await jwtSimple.encode(payload, config.jwtSecret);
                res.status(200).json({ token });
            } else {
                res.status(401).json({err: "invalid input"});
            }
        } else {
            res.status(401).json({err: "invalid input"});
        }
    }
}

module.exports = AuthRouter;