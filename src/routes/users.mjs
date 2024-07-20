import { Router } from "express";
import {
  checkSchema,
  matchedData,
  query,
  validationResult,
} from "express-validator";
import { mockUserData } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchema.mjs";
import { resolvevIndexByUserId } from "../utils/middlewares.mjs";

const router = Router();

router.get(
  "/api/users",
  query("username").isString().isLength({ min: 3 }).optional(),
  (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
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

router.get("/api/users/:id", resolvevIndexByUserId, (request, response) => {
  response.status(201).send(mockUserData[request.findIndex]);
});

// POST

router.post(
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

router.put("/api/users/:id", resolvevIndexByUserId, (request, response) => {
  const id = request.params.id;

  mockUserData[request.findIndex] = { id: +id, ...request.body };

  response.status(201).send(mockUserData);
});

// PATCH
router.patch("/api/users/:id", resolvevIndexByUserId, (request, response) => {
  mockUserData[request.findIndex] = {
    ...mockUserData[request.findIndex],
    ...request.body,
  };

  response.status(201).send(mockUserData);
});

// DELETE

router.delete("/api/users/:id", resolvevIndexByUserId, (request, response) => {
  mockUserData.splice(request.findIndex, 1);

  response.status(201).send(mockUserData);
});

export default router;
