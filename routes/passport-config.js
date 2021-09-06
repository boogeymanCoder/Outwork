const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmailUsername, getUserById) {
    const authenticateUser = async (emailUsername, password, done) => {
        const account = await getUserByEmailUsername(emailUsername);

        if (account == null) {
            return done(null, false, { message: 'No account with that email or username'});
        }

        try {
            if (await bcrypt.compare(password, account.password)) {
                if (account.verified) {
                    return done(null, account);
                }

                return done(null, false, { message: 'Please verify your email', });
            } else {
                return done(null, false, { message: 'Password Incorrect' });
            }
        } catch (err) {
            return done(err);
        }
    }

    passport.use(new LocalStrategy({ usernameField: 'emailUsername' }, authenticateUser));

    passport.serializeUser((account, done) => done(null, account._id));
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id)); 
    });
}

module.exports = initialize;