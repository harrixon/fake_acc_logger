const passport = require('passport');
const passportJWT = require('passport-jwt');
const config = require('../../config');
// const users = require('./users');
const ExtractJwt = passportJWT.ExtractJwt;

const users = {
    1: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6InVzZXJuYW1lIiwicGFzc3dvcmQiOiJwYXNzd29yZCJ9.WB7DoqlLqkv3rGsEjK4v_-CJzmnR450Gq-Tl4yOn0G0"
}

module.exports = ()=>{
    const strategy = new passportJWT.Strategy({
        secretOrKey: config.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },(payload,done)=>{
        const user = users[payload.id];
        if (user) {
            return done(null, {id: user.id});
        } else {
            return done(new Error("User not found"), null);
        }
    });
    passport.use(strategy);

    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", config.jwtSession);
        }
    };
}