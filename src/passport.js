import "dotenv/config";
import passport from "passport";
import passportlocal from "passport-local";
import bcrypt from "bcryptjs";
const LocalStrategy = passportlocal.Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
import UserModel from "./models/users";

passport.use(
  new LocalStrategy((username, password, done) => {
    //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
    return UserModel.findOne({ username })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // passwords match! log user in
            return done(null, user);
          } else {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" });
          }
        });
        return done(null, user, { message: "Logged In Successfully" });
      })
      .catch((err) => done(err));
  })
);
// ExtractJWT.fromAuthHeaderAsBearerToken()
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken("jwt"),
      secretOrKey: process.env.secret,
    },
    (jwtPayload, cb) => {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      UserModel.findById(jwtPayload.user)
        .then((user) => {
          return cb(null, user);
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);

export default passport;
