const passport = require('passport');
const passportJWT = require('passport-jwt');
const config = require('../../jwtConfig');
const ExtractJwt = passportJWT.ExtractJwt;



module.exports = (authServices) => {
    const strategy = new passportJWT.Strategy(
        {
            secretOrKey: config.jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async (payload, done) => {

            let userList = await authServices.getAllUsersUID();

            let user = userList.find((u) => {
                return u.UID = payload.UID;
            });

            if (user) {
                return done(null, { id: user.id });
            } else {
                return done(new Error("User not found"), null);
            }
        }
    );
    
    passport.use(strategy);

    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", config.jwtSession);
        }
    };
}