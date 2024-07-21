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
import { User } from "../mongoose/schema/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

router.get(
  "/api/users",
  query("username").isString().isLength({ min: 3 }).optional(),
  (request, response) => {
    console.log("session.id", request.session.id);
    request.sessionStore.get(request.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log("sessionData", sessionData);
    });
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
  async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ msg: result?.errors });

    // const data = matchedData(request);
    const { body } = request;
    console.log(body);
    body.password = hashPassword(body.password);
    const newUSer = new User(body);
    try {
      const savedUser = await newUSer.save();
      return response.status(200).send(savedUser);
    } catch (error) {
      console.log(error);
      return response.sendStatus(400);
    }
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
