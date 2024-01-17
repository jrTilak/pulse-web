import { Router } from "express";
import { verifyToken } from "../utils/token-manager";
import UserAuthController from "../controllers/auth-controllers";
import UserVerify from "../middlewares/verify/user.verify";
import { AuthValidator } from "../middlewares/validators/auth-validator";

const authRouter = Router();

/**
 * @GET - routes
 */

// Verify user
authRouter.get("/verify", verifyToken, UserAuthController.verifyUser);

/**
 * @POST - routes
 */

// Create a new guest user
authRouter.post(
  "/guest",
  AuthValidator.validateNewUser,
  UserVerify.verifyUsername,
  UserAuthController.createGuestUser
);

//Create a new email user.
authRouter.post(
  "/email",
  AuthValidator.validateNewUser,
  UserVerify.verifyUsername,
  UserVerify.verifyEmail,
  UserAuthController.createEmailUser
);

// Login user.
authRouter.post(
  "/login",
  AuthValidator.validateLoginCredentials,
  UserAuthController.loginUser
);

// Logout user.
authRouter.post("/logout", UserAuthController.logoutUser);

export default authRouter;
