const cryptoRandomString = require('crypto-random-string');
const demoUID = cryptoRandomString(10);

const bcrypt  = require("bcryptjs");

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
              /* 
                DO NOT PUT "ID" HERE IN THE SEED
                OR IT WILL MESS UP POSTGRES OWN PK COUNTER
              */
              ownerUID: `${demoUID}`,
              accID: `${cryptoRandomString(10)}`,
              serviceProvider: "Origin".toUpperCase(),
              loginType: "LOCAL",
              username: "testing",
              email: "",
              emailServiceProvider: "".toUpperCase(),
              password: "some pw hash",
              remark: "",
              URL: "",
              isActive: true
            },
            {
              ownerUID: `${demoUID}`,
              accID: `${cryptoRandomString(10)}`,
              serviceProvider: "steam".toUpperCase(),
              loginType: "SOCIAL",
              username: "testing",
              email: "testing@gmail.com",
              emailServiceProvider: "Google".toUpperCase(),
              password: "",
              remark: "something something",
              URL: "www.steam.com",
              isActive: true
            }
          ])
        })
    })
};
