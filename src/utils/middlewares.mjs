import { mockUserData } from "./constants.mjs";

// middleware
export const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
  next();
};

export const resolvevIndexByUserId = (request, response, next) => {
  const id = request.params.id;
  if (isNaN(id))
    return response.status(400).send({ msg: "Bad Request. Invalid ID." });

  const findIndex = mockUserData.findIndex((user) => user.id === +id);
  if (findIndex === -1) return response.sendStatus(404);
  request.findIndex = findIndex;
  next();
};
