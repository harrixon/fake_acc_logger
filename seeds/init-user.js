const cryptoRandomString = require('crypto-random-string');

const demoUID = cryptoRandomString(10);

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('systemUsers').del()
    .then(() => {
      // Inserts seed entries
      return knex('systemUsers').insert([
        {
          id: 1, 
          UID: `${demoUID}`,
          username: "demo",
          password: "123456"
        },        
      ]);
    })
    .then(()=>{
      return knex("doppelganger")
        .del()
        .then(()=>{
          return knex("doppelganger").insert([
            {
              id: 1,
              ownerUID: `${demoUID}`,
              accID: `${cryptoRandomString(10)}`,
              serviceProvider: "something co.",
              loginType: "local",
              username: "john doe",
              email: "",
              password: "some pw hash",
              remark: "",
              URL: "",
              isActive: true
            },
            {
              id: 2,
              ownerUID: `${demoUID}`,
              accID: `${cryptoRandomString(10)}`,
              serviceProvider: "another co.",
              loginType: "social",
              username: "jane doe",
              email: "jd4352665675@gmail.com",
              password: "",
              remark: "something something",
              URL: "www.anotherCo/login/",
              isActive: true
            }
          ])
        })
    })
};
