import express, { response } from "express";
import { loggingMiddleware } from "./utils/middlewares.mjs";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./strategies/local-strategy.mjs";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3002;

const app = express();

mongoose
  .connect("mongodb://localhost:27017/express_basics")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

app.use(express.json());

// You can set any secret code. In this code, we used "helloworld"
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "mjm2024!",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 15,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(loggingMiddleware);
app.use(routes);
app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
  console.log(request.session);
  console.log(request.session.id);

  request.session.visited = true;

  response.cookie("hello", "world", { maxAge: 60000 * 60, signed: true });
  response.status(201).send({ msg: "Hi" });
});

//  OLD: manual setting of session
// app.post("/api/auth", (request, response) => {
//   const { username, password } = request.body;

//   const findUsers = mockUserData.find((user) => user.username === username);
//   if (!findUsers) return response.status(401).send({ msg: "BAD CREDENTIALS" });

//   if (findUsers.password !== password)
//     return response.status(401).send({ msg: "BAD CREDENTIALS" });

//   request.session.user = findUsers;
//   return response.status(200).send(findUsers);
// });

// app.get("/api/auth/status", (request, response) => {
//   return request.session.user
//     ? response.status(200).send(request.session.user)
//     : response.status(401).send({ msg: "Not Authenticated" });
// });

// NEW: With Passport.js
app.post("/api/auth", passport.authenticate("local"), (request, response) => {
  const { username, password } = request.body;

  return response.sendStatus(200);
});

app.post("/api/auth/logout", (request, response) => {
  const { username, password } = request.body;

  if (!request.user) return response.sendStatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.sendStatus(200);
  });
});

app.get("/api/auth/status", (request, response) => {
  console.log("/api/auth/status");
  console.log(request.user);
  return request.user
    ? response.status(200).send(request.user)
    : response.sendStatus(400);
});
