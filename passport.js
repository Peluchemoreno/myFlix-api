const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models"),
  passportJWT = require("passport-jwt");

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      await Users.findOne({ username })
        .then((user) => {
          if (!user) {
            console.log("incorrect username");
            return callback(null, false, {
              message: "Incorrect username or password.",
            });
          }
          console.log("finished");
          callback(null, user);
        })
        .catch((err) => {
          console.error(`Error: ${err}`);
          return callback(err);
        });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: `ninja 4rr`,
    },
    async (jwtPayload, callback) => {
      return await Users.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((err) => {
          console.error(`Error: ${err}`);
          return callback(err);
        });
    }
  )
);
