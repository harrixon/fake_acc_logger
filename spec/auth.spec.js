const app = require("./../app");
const request = require("supertest")(app);

describe("authentication", () => {
    describe("POST /login", () => {
        it("should respond with a jwt-token", (done) => {
            request
                .post("/api/auth/login")
                .send({ username: "demo", password: "123456" })
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    err ? console.log(err) : done();
                });
        });

        it("should respond with a 401 given a invalid input", (done) => {
            request
                .post("/api/auth/login")
                .send({ username: "wrongname", password: "password" })
                .expect("Content-type", /json/)
                .expect(401)
                .end((err, res) => {
                    err ? console.log(err) : done();
                });
        });

        it("should respond with a 401 given a invalid input", (done) => {
            request
                .post("/api/auth/login")
                .send({ username: "username", password: "passssssword" })
                .expect("Content-type", /json/)
                .expect(401)
                .end((err, res) => {
                    err ? console.log(err) : done();
                });
        });
    });

    describe("USE /service", () => {
        it("should reject un-auth request to 'accList'", done => {
            request
                .get("/api/service/accList")
                .set("Accept", "application/json")
                .expect(401)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    } else {
                        done()
                    }
                });
        });

        it("should reject un-auth request to 'byServiceProvider'", done => {
            request
                .get("/api/service/byServiceProvider")
                .set("Accept", "application/json")
                .expect(401)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    } else {
                        done()
                    }
                });
        });

        it("should reject un-auth request to 'byEmailServiceProvider'", done => {
            request
                .get("/api/service/byEmailServiceProvider")
                .set("Accept", "application/json")
                .expect(401)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    } else {
                        done()
                    }
                });
        });
        
        it("should reject un-auth request to 'newAcc'", done => {
            request
                .post("/api/service/newAcc")
                .set("Accept", "application/json")
                .expect(401)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    } else {
                        done()
                    }
                });
        });

        it("should reject un-auth request to 'updateAcc'", done => {
            request
                .post("/api/service/updateAcc")
                .set("Accept", "application/json")
                .expect(401)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    } else {
                        done()
                    }
                });
        });

        it("should reject un-auth request to 'deactivateAcc'", done => {
            request
                .post("/api/service/deactivateAcc")
                .set("Accept", "application/json")
                .expect(401)
                .end((err, res) => {
                    if (err) {
                        throw err;
                    } else {
                        done()
                    }
                });
        });
    });
});