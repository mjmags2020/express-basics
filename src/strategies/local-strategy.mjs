import passport from "passport";
import { Strategy } from "passport-local";
import { mockUserData } from "../utils/constants.mjs";

passport.serializeUser((user, done) => {
  console.log("serializeUser", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("deserializeUser", id);

  try {
    const findUser = mockUserData.find((user) => user.id === id);
    if (!findUser) throw new Error("User not found");

    done(null, findUser);
  } catch (error) {
    done(err, null);
  }
});

export default passport.use(
  new Strategy((username, password, done) => {
    console.log(`${username} - ${password}`);
    try {
      const findUser = mockUserData.find((user) => user.username === username);

      if (!findUser) throw new Error("User not found");
      if (findUser.password !== password) throw new Error("Uer Mismatched");

      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
