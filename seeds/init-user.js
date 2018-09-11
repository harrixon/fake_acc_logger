const cryptoRandomString = require('crypto-random-string');
const bcrypt  = require("bcryptjs");

const demoUID = cryptoRandomString(10);

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  let hash = await bcrypt.hash("123456", 10);
  return knex('systemUsers').del()
    .then(() => {
      // Inserts seed entries
      console.log(hash)
      return knex('systemUsers').insert([
        {
          id: 1, 
          UID: `${demoUID}`,
          username: "demo",
          password: hash
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
              emailServiceProvider: "",
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
              emailServiceProvider: "Google",
              password: "",
              remark: "something something",
              URL: "www.anotherCo/login/",
              isActive: true
            }
          ])
        })
    })
};
