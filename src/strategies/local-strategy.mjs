import passport from "passport";
import { Strategy } from "passport-local";
import { mockUserData } from "../utils/constants.mjs";
import { User } from "../mongoose/schema/user.mjs";

passport.serializeUser((user, done) => {
  console.log("serializeUser", user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("deserializeUser", id);

  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User not found");

    done(null, findUser);
  } catch (error) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({
        username,
      });
      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password) throw new Error("User mismatched");

      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
