import express from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchema.mjs";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;

const mockUserData = [
  {
    id: 1,
    username: "mjm",
  },
  {
    id: 2,
    username: "mjm2",
  },
];
// middleware
const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};
const resolvevIndexByUserId = (request, response, next) => {
  const id = request.params.id;
  if (isNaN(id))
    return response.status(400).send({ msg: "Bad Request. Invalid ID." });

  const findIndex = mockUserData.findIndex((user) => user.id === +id);
  if (findIndex === -1) return response.sendStatus(404);
  request.findIndex = findIndex;
  next();
};

app.use(loggingMiddleware);
// GET
app.get("/", (request, response) => {
  response.status(201).send({ msg: "hello" });
});

app.get(
  "/api/users",
  query("username").isString().notEmpty().isLength({ min: 3 }),
  (request, response) => {
    const result = validationResult(request);
    if (result?.errors)
      return response.status(400).send({ msg: result?.errors });
    const {
      query: { username },
    } = request;

    if (username)
      return response
        .status(201)
        .send(mockUserData.find((user) => user.username === username));

    response.status(201).send(mockUserData);
  }
);

app.get("/api/users/:id", resolvevIndexByUserId, (request, response) => {
  response.status(201).send(mockUserData[request.findIndex]);
});

app.get("/api/products", (request, response) => {
  response.status(201).send([
    {
      id: 1,
      username: "chicken",
      price: 12,
    },
    {
      id: 2,
      products: "vegetable",
      price: 31,
    },
  ]);
});

// POST

app.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ msg: result?.errors });

    const data = matchedData(request);

    const newUser = {
      id: mockUserData[mockUserData.length - 1].id + 1,
      ...data,
    };
    mockUserData.push(newUser);
    return response.send({ msg: mockUserData });
  }
);

// PUT

app.put("/api/users/:id", resolvevIndexByUserId, (request, response) => {
  const id = request.params.id;

  mockUserData[request.findIndex] = { id: +id, ...request.body };

  response.status(201).send(mockUserData);
});

// PATCH
app.patch("/api/users/:id", resolvevIndexByUserId, (request, response) => {
  mockUserData[request.findIndex] = {
    ...mockUserData[request.findIndex],
    ...request.body,
  };

  response.status(201).send(mockUserData);
});

// DELETE

app.delete("/api/users/:id", resolvevIndexByUserId, (request, response) => {
  mockUserData.splice(request.findIndex, 1);

  response.status(201).send(mockUserData);
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
