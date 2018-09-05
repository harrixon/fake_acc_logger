const app = require("./../app");
const request = require("supertest")(app);

describe("router", ()=>{
    // it ("should handle auth with OAuth2.0");
    // it ("should allow access to all api only with auth");

    this.packageLogin = {
        id: 1,
        username: "username",
        password: "password"
    };

    this.serviceProvider = {serviceProvider:"origin"};
    this.emailProvider = {emailProvider:"Google"};

    this.packageAdd = {                
        type: "ADD",
        serviceProvider: "origin",
        loginType: "Google",
        username: "testing",
        email: "testing@gmail.com",
        password: "testing",
        remark: "none",
        URL: "none",
    };
    this.packageUpdate = {                
        type: "UPDATE",
        serviceProvider: "origin",
        loginType: "Google",
        username: "testing",
        email: "testing@gmail.com",
        update: {
            newLoginType: "LOCAL",
            newUsername: "string",
            newEmail: "string",
            newPassword: "string",
            newRemark: "string",
            newURL: "string",
        }
    };
    this.packageDelete = {                
        type: "DELETE",
        serviceProvider: "origin",
        loginType: "Google",
        username: "testing",
        email: "testing@gmail.com",
    };

    beforeAll((done)=>{
        // get login token
        request
            .post("/api/auth/login")
            .send({username: "username", password: "password"})
            .expect("Content-type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    this.token = res.body.token;
                    done();
                }
            });
    });
        
    describe("GET /accList", ()=>{
        it("respond with json", (done)=>{
            request
                .get("/api/service/accList")
                .set('Authorization', 'bearer ' + this.token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(201)
                .end((err, res) => {
                    err ? console.log(`ERR: ${err}`) : done();
                });
        });
    });

    describe("GET /byServiceProvider", ()=>{
        it("respond with json", (done)=>{
            request
                .get("/api/service/byServiceProvider")
                .query(this.serviceProvider)
                .set('Authorization', 'bearer ' + this.token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(201)
                .end((err, res) => {
                    err ? console.log(`ERR: ${err}`) : done();
                });
        });
    });

    describe("GET /byEmailProvider", ()=>{
        it("respond with json", (done)=>{
            request
                .get("/api/service/byEmailProvider")
                .query(this.emailProvider)
                .set('Authorization', 'bearer ' + this.token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(201)
                .end((err, res) => {
                    err ? console.log(`ERR: ${err}`) : done();
                });
        });
    });

    describe("POST /newAcc", ()=>{
        it("respond with json", (done)=>{
            request
                .post("/api/service/newAcc")
                .send(this.packageAdd)
                .set('Authorization', 'bearer ' + this.token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(201)
                .end((err, res) => {
                    err ? console.log(`ERR: ${err}`) : done();
                });
        });
    });

    describe("POST /updateAcc", ()=>{
        it("respond with json", (done)=>{
            request
                .post("/api/service/updateAcc")
                .send(this.packageUpdate)
                .set('Authorization', 'bearer ' + this.token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(201)
                .end((err, res) => {
                    err ? console.log(`ERR: ${err}`) : done();
                });
        });
    });

    describe("POST /delAcc", ()=>{
        it("respond with json", (done)=>{
            request
                .post("/api/service/delAcc")
                .send(this.packageDelete)
                .set('Authorization', 'bearer ' + this.token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(201)
                .end((err, res) => {
                    err ? console.log(`ERR: ${err}`) : done();
                });
        });
    });
});