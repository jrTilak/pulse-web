import { Router } from "express";
import authRouter from "./auth-route";
import chatRouter from "./chat-route";

const appRouter = Router();

appRouter.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API of Pulse Backend!",
  });
});

appRouter.use("/auth", authRouter);
appRouter.use("/chats", chatRouter);
// appRouter.use("/user", userRouter);
// appRouter.use("/story", storyRouter);
// appRouter.use("/post", postRouter);
// appRouter.use("/file", fileRouter);

export default appRouter;
