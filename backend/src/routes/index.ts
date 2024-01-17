import { Router } from "express";
import authRouter from "./auth-route";

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API of Pulse Backend!",
  });
});

appRouter.use("/auth", authRouter);

export default appRouter;
