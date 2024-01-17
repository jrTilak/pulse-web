import { Router } from "express";
import { verifyToken } from "../utils/token-manager";
import UserController from "../controllers/user-controllers";
import UserValidator from "../middlewares/validators/user.validators";

const userRouter = Router();

/**
 * @GET -routes
 */
userRouter.get("/u/:username", UserController.getUserByUsername);
userRouter.get("/id/:id", UserController.getUserById);
userRouter.get("/all", UserController.getAllUsers);
userRouter.get("/followers", verifyToken, UserController.getFollowersList);
userRouter.get("/following", verifyToken, UserController.getFollowingList);
userRouter.get(
  "/suggested-users",
  verifyToken,
  UserController.getSuggestedUsers
);

/**
 * @POST -routes
 */
userRouter.post("/u/:username/follow", verifyToken, UserController.followUser);
userRouter.post("/new/story/:type", verifyToken, UserController.createNewStory);

/**
 * @PUT -routes
 */
userRouter.put(
  "/edit",
  verifyToken,
  UserValidator.validateEditUserDetails,
  UserController.editUserDetails
);

/**
 * @DELETE -routes
 */
userRouter.delete(
  "/u/:username/follow",
  verifyToken,
  UserController.followUser
);

export default userRouter;
