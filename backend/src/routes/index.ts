import { Router } from "express";

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});

export default appRouter;
