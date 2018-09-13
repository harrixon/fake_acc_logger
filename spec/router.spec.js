const app = require("./../app");
const request = require("supertest")(app);
const cryptoRandomString = require('crypto-random-string');

const testData = require("./testData");

describe("router", () => {

    let token = "";

    const packageAdd = (name) => {
        return {
            type: "ADD",
            serviceProvider: `${name}`,
            loginType: "SOCIAL",
            username: "testing",
            email: "testing@gmail.com",
            emailServiceProvider: "Google",
            password: "",
            remark: "",
            URL: "",
        }
    };

    const wrongPackageStructure = (pkg) => {
        let goodPkg = pkg.map(p => {
            let goodItem = testData.body.add.return_pkg_structure.map(s => (p.hasOwnProperty(s)));
            let itemSet = new Set(goodItem);
            if (itemSet.has(false)) {
                return false;
            } else {
                return true;
            }
        });
        let pkgSet = new Set(goodPkg);
        return pkgSet.has(false);
    }

    const moreThanOneServiceProvider = (pkg, sp) => {
        let fail = pkg.find(p => {
            return (p.serviceProvider != sp.serviceProvider);
        });
        return fail;
    }

    const wrongEmailServiceProvider = (pkg, e) => {
        let fail = pkg.find(p => {
            return (p.emailServiceProvider.toUpperCase() != e.emailServiceProvider.toUpperCase());
        });
        return fail;
    }

    beforeAll(done => {
        // get login token
        console.log("=== login to get token ===");
        request
            .post("/api/auth/login")
            .send(testData.loginPackage)
            .expect("Content-type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    throw new Error(err);
                } else {
                    token = res.body.token;
                    console.log("=== token received ===");
                    done();
                }
            });
    });

    xdescribe("GET /accList", () => {
        it("should respond with json", done => {
            request
                .get("/api/service/accList")
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log("spec: ", err);
                        throw err;
                    } else {
                        if (wrongPackageStructure(res.body.resultPkg)) {
                            throw new Error ("result package structure is wrong!");
                        } else {
                            done();
                        }
                    }
                });
        });
    });

    xdescribe("GET /byServiceProvider", () => {
        it("should respond with json", done => {
            request
                .get("/api/service/byServiceProvider")
                .query(testData.query.serviceProvider)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log("spec: ", err);
                        throw (err);
                    } else {
                        // check if return pkg structure is correct
                        if (wrongPackageStructure(res.body.resultPkg)) {
                            throw new Error ("result package structure is wrong!");
                        } else {
                            // check if return pkg is correct
                            if (moreThanOneServiceProvider(res.body.resultPkg, testData.query.serviceProvider)) {
                                throw new Error ("accs of more than one service provider is fetched");
                            } else {
                                done();
                            }
                        }
                    }
                });
        });

        it("should reject invalid query", done => {
            request
                .get("/api/service/byServiceProvider")
                .query(testData.query.invalid_serviceProvider)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", "text/html; charset=utf-8")
                .expect(400)
                .end((err, res) => {
                    if (res.error.text === "invalid query") {
                        done(err);
                    } else {
                        console.log(`ERR: ${err}`);
                        throw new Error (err);
                    }
                });
        });
    });

    xdescribe("GET /byEmailServiceProvider", () => {
        it("should respond with json", done => {
            request
                .get("/api/service/byEmailServiceProvider")
                .query(testData.query.emailServiceProvider)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        console.log("spec: ", err);
                        done(err);
                    } else {
                        if (wrongPackageStructure(res.body.resultPkg)) {
                            throw new Error ("result package structure is wrong!");
                        } else {
                            if (wrongEmailServiceProvider(res.body.resultPkg, testData.query.emailServiceProvider)) {
                                throw new Error ("accs of more than one / wrong email service provider is fetched");
                            } else {
                                done();
                            }
                        }
                    }
                });
        });

        it("should reject invalid query", done => {
            request
                .get("/api/service/byEmailServiceProvider")
                .query(testData.query.invalid_emailServiceProvider)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", "text/html; charset=utf-8")
                .expect(400)
                .end((err, res) => {
                    if (res.error.text === "invalid query") {
                        done(err);
                    } else {
                        throw (err);
                    }
                });
        });
    });

    xdescribe("POST /newAcc", () => {
        it("should respond with json", done => {
            request
                .post("/api/service/newAcc")
                .send(packageAdd(`${cryptoRandomString(6)} Co.`))
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        throw (err);
                    } else {
                        done();
                    }
                });
        });

        it("should reject with acc already exist", done => {
            request
                .post("/api/service/newAcc")
                .send(testData.body.add.duplicateAdd)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", "text/html; charset=utf-8")
                .expect(400)
                .end((err, res) => {
                    if (res.error.text === "account already exist") {
                        done(err);
                    } else {
                        throw (err);
                    }
                });
        });

        it("should reject with bad package", done => {
            request
                .post("/api/service/newAcc")
                .send(testData.body.add.invalid_pkg)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", "text/html; charset=utf-8")
                .expect(400)
                .end((err, res) => {
                    if (res.error.text === "bad package") {
                        done(err);
                    } else {
                        throw (err);
                    }
                });
        });
    });

    xdescribe("POST /updateAcc", () => {
        it("respond with json", done => {
            request
                .post("/api/service/updateAcc")
                .send(testData.body.update.valid)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        throw (err);
                    } else {
                        done();
                    }
                });
        });

        it("should reject wrong action type", done => {
            request
                .post("/api/service/updateAcc")
                .send(testData.body.update.wrong_type)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", "text/html; charset=utf-8")
                .expect(400)
                .end((err, res) => {
                    if (res.error.text === "bad package") {
                        done(err);
                    } else {
                        throw (err);
                    }
                });
        });

        xit("should reject invalid update details", done => {
            request
                .post("/api/service/updateAcc")
                .send(testData.body.update.invalid_details)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", "text/html; charset=utf-8")
                .expect(400)
                .end((err, res) => {
                    if (res.error.text === "bad package") {
                        done(err);
                    } else {
                        throw (err);
                    }
                });
        });

        it("should deal with non existing acc", done => {
            request
                .post("/api/service/updateAcc")
                .send(testData.body.update.wrong_accID)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", "text/html; charset=utf-8")
                .expect(400)
                .end((err, res) => {
                    if (res.error.text === "account does not exist") {
                        done(err);
                    } else {
                        throw (err);
                    }
                });
        });
    });

    describe("POST /deactivateAcc", () => {
        it("should respond with json", done => {
            request
                .post("/api/service/deactivateAcc")
                .send(testData.body.deactivate.valid)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                // .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        throw (err);
                    } else {
                        done();
                    }
                });
        });

        it("should reject wrong action type", done => {
            request
                .post("/api/service/deactivateAcc")
                .send(testData.body.deactivate.wrong_type)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", "text/html; charset=utf-8")
                .expect(400)
                .end((err, res) => {
                    if (res.error.text === "bad package") {
                        done(err);
                    } else {
                        throw (err);
                    }
                });
        });

        it("should deal with non existing acc", done => {
            request
                .post("/api/service/deactivateAcc")
                .send(testData.body.deactivate.wrong_accID)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", "text/html; charset=utf-8")
                .expect(400)
                .end((err, res) => {
                    if (res.error.text === "account does not exist") {
                        done(err);
                    } else {
                        throw (err);
                    }
                });
        });
    });
});