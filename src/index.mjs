import express from "express";

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

// GET
app.get("/", (request, response) => {
  response.status(201).send({ msg: "hello" });
});

app.get("/api/users", (request, response) => {
  console.log(request.query);
  const {
    query: { username },
  } = request;

  if (username)
    return response
      .status(201)
      .send(mockUserData.find((user) => user.username === username));

  response.status(201).send(mockUserData);
});

app.get("/api/users/:id", (request, response) => {
  const id = request.params.id;
  if (isNaN(id))
    return response.status(400).send({ msg: "Bad Request. Invalid ID." });

  const user = mockUserData.find((user) => user.id === +id);

  if (!user) return response.sendStatus(404);

  response.status(201).send(user);
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

app.post("/api/users", (request, response) => {
  console.log(request.body);
  const newUser = {
    id: mockUserData[mockUserData.length - 1].id + 1,
    ...request.body,
  };
  mockUserData.push(newUser);
  return response.send({ msg: mockUserData });
});

// PUT

app.put("/api/users/:id", (request, response) => {
  const id = request.params.id;
  if (isNaN(id))
    return response.status(400).send({ msg: "Bad Request. Invalid ID." });

  const findIndex = mockUserData.findIndex((user) => user.id === +id);
  if (findIndex === -1) return response.sendStatus(404);

  mockUserData[findIndex] = { id: +id, ...request.body };

  response.status(201).send(mockUserData);
});

// PATCH
app.patch("/api/users/:id", (request, response) => {
  const id = request.params.id;
  if (isNaN(id))
    return response.status(400).send({ msg: "Bad Request. Invalid ID." });

  const findIndex = mockUserData.findIndex((user) => user.id === +id);
  if (findIndex === -1) return response.sendStatus(404);

  mockUserData[findIndex] = { ...mockUserData[findIndex], ...request.body };

  response.status(201).send(mockUserData);
});

// DELETE

app.delete("/api/users/:id", (request, response) => {
  const id = request.params.id;
  if (isNaN(id))
    return response.status(400).send({ msg: "Bad Request. Invalid ID." });

  const findIndex = mockUserData.findIndex((user) => user.id === +id);
  if (findIndex === -1) return response.sendStatus(404);

  mockUserData.splice(findIndex, 1);

  response.status(201).send(mockUserData);
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
