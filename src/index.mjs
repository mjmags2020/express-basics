import express from "express";
import { loggingMiddleware } from "./utils/middlewares.mjs";
import routes from "./routes/index.mjs";

const PORT = process.env.PORT || 3002;

const app = express();
app.use(express.json());

app.use(loggingMiddleware);
app.use(routes);

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
