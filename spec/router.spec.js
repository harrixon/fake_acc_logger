const app = require("./../app");
const request = require("supertest")(app);

describe("router", ()=>{

    this.packageLogin = {
        username: "demo",
        password: "123456"
    };

    this.serviceProvider = {serviceProvider:"something co."};
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
    this.packageStructure = [
        "id", 
        "ownerUID", 
        "accID",
        "serviceProvider",
        "loginType",
        "username",
        "email",
        "password",
        "remark",
        "URL"
    ];

    this.wrongPackageStructure = (pkg) => {
        let goodPkg = pkg.map(p => {
            let goodItem = this.packageStructure.map(s =>(p.hasOwnProperty(s)));
            let itemSet = new Set(goodItem);
            if (itemSet.has(false)) {
                return false;
            } else {
                return true;
            }
        });
        let pkgSet = new Set (goodPkg);
        return pkgSet.has(false);
    }

    this.moreThanOneServiceProvider = (pkg, sp) => {
        let fail = pkg.find(p => {
            return (p.serviceProvider != sp.serviceProvider);
        });
        return fail;
    }

    beforeAll((done)=>{
        // get login token
        request
            .post("/api/auth/login")
            .send(this.packageLogin)
            .expect("Content-type", /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    throw new Error (err);
                } else {
                    this.token = res.body.token;
                    done();
                }
            });
    });
        
    xdescribe("GET /accList", ()=>{
        it("respond with json", (done)=>{
            request
                .get("/api/service/accList")
                .set('Authorization', 'bearer ' + this.token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) {
                        console.log("spec: ", err);
                        throw new Error (err);
                    } else {
                        if (this.wrongPackageStructure(res.body.resultPkg)) {
                            console.log("spec: ", "result package structure is wrong!");
                            throw new Error ("result package structure is wrong!");
                        } else {
                            done();
                        }
                    }
                });
        });
    });

    xdescribe("GET /byServiceProvider", ()=>{
        it("respond with json", (done)=>{
            request
                .get("/api/service/byServiceProvider")
                .query(this.serviceProvider)
                .set('Authorization', 'bearer ' + this.token)
                .set("Accept", "application/json")
                .expect("Content-type", /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) {
                        console.log("spec: ", err);
                        throw new Error (err);
                    } else {
                        if (this.wrongPackageStructure(res.body.resultPkg)) {
                            console.log("spec: ", "result package structure is wrong!");
                            throw new Error ("result package structure is wrong!");
                        } else {
                            if (this.moreThanOneServiceProvider(res.body.resultPkg, this.serviceProvider)) {
                                console.log("spec: ", "accs more than one service provider is fetched");
                                throw new Error ("accs more than one service provider is fetched");
                            } else {
                                done();
                            }
                        }
                    }
                });
        });
    });

    xdescribe("GET /byEmailProvider", ()=>{
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

    xdescribe("POST /newAcc", ()=>{
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

    xdescribe("POST /updateAcc", ()=>{
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

    xdescribe("POST /delAcc", ()=>{
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