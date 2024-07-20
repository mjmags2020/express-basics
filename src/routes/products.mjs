import { Router } from "express";

const router = Router();
router.get("/api/products", (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.signedCookies);
  if (request.signedCookies.hello && request.signedCookies.hello === "world") {
    return response.status(201).send([
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
  }

  return response.status(403).send({ msg: "Need Correct Cookie." });
});

export default router;
