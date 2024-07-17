import express from "express";

const app = express();

const PORT = process.env.PORT || 3002;

app.get("/", (request, response) => {
  response.status(201).send({ msg: "hello" });
});
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

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
