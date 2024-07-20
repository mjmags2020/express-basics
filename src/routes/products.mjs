import { Router } from "express";

const router = Router();
router.get("/api/products", (request, response) => {
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

export default router;
