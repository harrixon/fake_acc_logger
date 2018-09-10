// import config
const dotenv = require("dotenv");
dotenv.config();

// import express
const express = require("express");
const app = express();

// import knex
const Knex = require("knex");
const KnexConfig = require("./knexfile");
const knex = Knex(KnexConfig[process.env.currentEnv]);

// import all services
const AuthServices = require("./service/authServices");
const authServices = new AuthServices(knex);
const AccountServices = require("./service/accountServices");
const accountServices = new AccountServices(knex);

// assigning services
const jwtStrategy = require("./util/auth/jwtStrategy");
const jwtAuth = jwtStrategy(authServices);

const ApiRouter = require("./router/ApiRouter");
const apiRouter = new ApiRouter(jwtAuth, express, authServices, accountServices, knex);

// import middleware for Express
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", apiRouter.router());

const http = require("http");
const server = http.createServer(app);
server.listen(8080, ()=>{
    console.log("server listening to port 8080");
});

module.exports = app;