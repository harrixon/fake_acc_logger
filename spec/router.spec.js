const app = require("./../app");
const request = require("supertest")(app);
const cryptoRandomString = require('crypto-random-string');

describe("router", () => {

    const packageLogin = {
        username: "demo",
        password: "123456"
    };

    let token = "";

    const serviceProvider = { serviceProvider: "something co." };
    const emailServiceProvider = { emailServiceProvider: "Google" };

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
    const badPackageAdd = {
        type: "update",
        serviceProvider: null,
        loginType: "LOC",
        username: "",
        email: "testing@gmail.com",
        emailServiceProvider: "Google",
        password: undefined,
        remark: "",
        URL: "",
    };

    const packageUpdate = {
        type: "UPDATE",
        serviceProvider: "origin",
        loginType: "SOCIAL",
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

    const packageDeactivate = {
        type: "DEACTIVATE",
        accID: "a016641bbc",
    };
    const badPackageDeactivate = {
        type: "DEACTIVA3rewfTE",
        accID: "a016641bbc",
    };
    const badPackageDeactivate2 = {
        type: "DEACTIVATE",
        accID: "123423tr",
    };

    const packageStructure = [
        "id",
        "ownerUID",
        "accID",
        "serviceProvider",
        "loginType",
        "username",
        "email",
        "emailServiceProvider",
        "password",
        "remark",
        "URL"
    ];

    const wrongPackageStructure = (pkg) => {
        let goodPkg = pkg.map(p => {
            let goodItem = packageStructure.map(s => (p.hasOwnProperty(s)));
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
            .send(packageLogin)
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

        // xit("should reject un-auth request", done => {
        //     request
        //         .get("/api/service/accList")
        //         .set("Accept", "application/json")
        //         .expect(401)
        //         .end((err, res) => {
        //             console.log(err)
        //             done(err)
        //         });
        // })
    });

    xdescribe("GET /byServiceProvider", () => {
        it("should respond with json", done => {
            request
                .get("/api/service/byServiceProvider")
                .query(serviceProvider)
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
                            if (moreThanOneServiceProvider(res.body.resultPkg, serviceProvider)) {
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
                .query({ serviceProvider: "" })
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
                .query(emailServiceProvider)
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
                            if (wrongEmailServiceProvider(res.body.resultPkg, emailServiceProvider)) {
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
                .query({})
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
                .send(packageAdd("origin"))
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
                .send(badPackageAdd)
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

    describe("POST /updateAcc", () => {
        xit("respond with json", done => {
            request
                .post("/api/service/updateAcc")
                .send(packageUpdate)
                .set('Authorization', 'bearer ' + token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(200)
                .end((err, res) => {
                    err ? console.log(`ERR: ${err}`) : done();
                });
        });
    });

    xdescribe("POST /deactivateAcc", () => {
        it("should respond with json", done => {
            request
                .post("/api/service/deactivateAcc")
                .send(packageDeactivate)
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

        it("should reject bad request", done => {
            request
                .post("/api/service/deactivateAcc")
                .send(badPackageDeactivate)
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
                .send(badPackageDeactivate2)
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
        })
    });
});