import express, { response } from "express";
import { loggingMiddleware } from "./utils/middlewares.mjs";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3002;

const app = express();
app.use(cookieParser("helloworld"));
app.use(express.json());

app.use(loggingMiddleware);
app.use(routes);

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});

app.get("/", (request, response) => {
  response.cookie("hello", "world", { maxAge: 10000, signed: true });
  response.status(201).send({ msg: "Hi" });
});
