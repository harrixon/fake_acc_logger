module.exports = {
    loginPackage: {
        username: "demo",
        password: "123456"
    },
    query: {
        serviceProvider: {
            serviceProvider: "Origin"
        },
        serviceProvider_notFound: {
            serviceProvider: "noSuchCompany"
        },
        invalid_serviceProvider: [
            { serviceProvider: "" }, { serviceProvider: undefined }, { sadfgffdb: "adsfgndfdgbd" }, {serviceProvider: {}}
        ],
        emailServiceProvider: {
            emailServiceProvider: "Google"
        },
        emailServiceProvider_notFound: {
            emailServiceProvider: "noSuchProvider"
        },
        invalid_emailServiceProvider: [
            { emailServiceProvider: "" }, { emailServiceProvider: undefined }, { sadfgffdb: "adsfgndfdgbd" }, {serviceProvider: {}}
        ]
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
                accID: "accID0001",
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
                accID: "accID0001",
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
    },
    seeds: {
        accs: [
            {
                ownerUID: "12cb97a020",
                accID: `accID0001`,
                serviceProvider: "Origin".toUpperCase(),
                loginType: "LOCAL",
                username: "testing",
                email: "",
                emailServiceProvider: "".toUpperCase(),
                password: "somepwhash",
                remark: "",
                URL: "",
                isActive: true
            },
            {
                ownerUID: "12cb97a020",
                accID: "accID0002",
                serviceProvider: "steam".toUpperCase(),
                loginType: "SOCIAL",
                username: "testing",
                email: "testing@gmail.com",
                emailServiceProvider: "Google".toUpperCase(),
                password: "",
                remark: "somethingsomething",
                URL: "www.steam.com",
                isActive: true
            },
            {
                ownerUID: "12cb97a020",
                accID: `accID0003`,
                serviceProvider: "cube".toUpperCase(),
                loginType: "SOCIAL",
                username: "cubic",
                email: "cubic@gmail.com",
                emailServiceProvider: "google".toUpperCase(),
                password: "somePWhash",
                remark: "",
                URL: "",
                isActive: true
            },
            {
                ownerUID: "00UID00004",
                accID: `accID0005`,
                serviceProvider: "se".toUpperCase(),
                loginType: "LOCAL",
                username: "SE",
                email: "se@gmail.com",
                emailServiceProvider: "google".toUpperCase(),
                password: "SomePWhasH",
                remark: "",
                URL: "",
                isActive: true
            },
        ]
    }
}
