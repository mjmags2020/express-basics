import express, { response } from "express";
import { loggingMiddleware } from "./utils/middlewares.mjs";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUserData } from "./utils/constants.mjs";

const PORT = process.env.PORT || 3002;

const app = express();
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

app.post("/api/auth", (request, response) => {
  const { username, password } = request.body;

  const findUsers = mockUserData.find((user) => user.username === username);
  if (!findUsers) return response.status(401).send({ msg: "BAD CREDENTIALS" });

  if (findUsers.password !== password)
    return response.status(401).send({ msg: "BAD CREDENTIALS" });

  request.session.user = findUsers;
  return response.status(200).send(findUsers);
});
app.get("/api/auth/status", (request, response) => {
  return request.session.user
    ? response.status(200).send(request.session.user)
    : response.status(401).send({ msg: "Not Authenticated" });
});
