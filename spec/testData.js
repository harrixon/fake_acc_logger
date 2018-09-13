module.exports = {
    loginPackage: {
        username: "demo",
        password: "123456"
    },
    query: {
        serviceProvider: {
            serviceProvider: "something co."
        },
        invalid_serviceProvider: {
            serviceProvider: ""
        },
        emailServiceProvider: { 
            emailServiceProvider: "Google"
        },
        invalid_emailServiceProvider: { 
            emailServiceProvider: ""
        },
    },
    body: {
        add: {
            invalid_pkg: {
                type: "update",
                serviceProvider: null,
                loginType: "LOC",
                username: "",
                email: "testing@gmail.com",
                emailServiceProvider: "Google",
                password: undefined,
                remark: "",
                URL: "",
            },
            duplicateAdd: {
                type: "ADD",
                serviceProvider: "origin",
                loginType: "LOCAL",
                username: "testing",
                email: "",
                emailServiceProvider: "",
                password: "some pw hash",
                remark: "",
                URL: "",
            },
            return_pkg_structure: [
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
            ]
        },
        update: {
            valid: {
                type: "UPDATE",
                serviceProvider: "origin",
                accID: "589296a354",
                details: {
                    loginType: "LOCAL",
                    username: "updated",
                    email: "",
                    password: "updated",
                    remark: "updated",
                    URL: "updated.com",
                }
            },
            wrong_type: {
                // type: "WRONGTYPE",
                accID: "a016641bbc",
                details: {
                    loginType: "LOCAL",
                    username: "wrong_type",
                    email: "wrong_type@wrong_type.com",
                    password: "wrong_type",
                    remark: "wrong_type",
                    URL: "wrong_type",
                }
            },
            wrong_accID: {
                type: "UPDATE",
                accID: "realIDhas10char",
                details: {
                    loginType: "LOCAL",
                    username: "wrong_accID",
                    email: "wrong_accID",
                    password: "wrong_accID",
                    remark: "wrong_accID",
                    URL: "wrong_accID",
                }
            },
            invalid_details: {
                type: "UPDATE",
                serviceProvider: "origin",
                accID: "a016641bbc",
                details: {
                    UID: "invalid_input",
                    accID: "invalid_input",
                    loginType: "LOCAL",
                    username: "",
                    email: "",
                    password: "invalid_details",
                    URL: "invalid_details",
                    fakeColumn: "",
                    fakeColumn2: undefined,
                }
            }
        },
        deactivate: {
            valid: {
                type: "DEACTIVATE",
                accID: "6d2d862695",
            },
            wrong_type: {
                type: "WRONGTYPE",
                accID: "a016641bbc",
            },
            wrong_accID: {
                type: "DEACTIVATE",
                accID: "realIDhas10char",
            }
        }
    }
}
