const app = require("./../app");
const request = require("supertest")(app);

describe("authentication", ()=>{
    describe("POST /login" ,()=>{
        it ("should respond with a jwt-token", (done) => {
            request
                .post("/api/auth/login")
                .send({username: "username", password: "password"})
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    err ? console.log(err) : done();
                });
        });

        it ("should respond with a 401 given a invalid username", (done) => {
            request
                .post("/api/auth/login")
                .send({username: "wrongname", password: "password"})
                .expect("Content-type", /json/)
                .expect(401)
                .end((err, res) => {
                    err ? console.log(err) : done();
                });
        });

        it ("should respond with a 401 given a invalid password", (done) => {
            request
                .post("/api/auth/login")
                .send({username: "username", password: "passssssword"})
                .expect("Content-type", /json/)
                .expect(401)
                .end((err, res) => {
                    err ? console.log(err) : done();
                });
        });
    });
});