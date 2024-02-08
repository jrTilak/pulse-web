"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_manager_1 = require("../utils/token-manager");
const auth_controllers_1 = __importDefault(require("../controllers/auth-controllers"));
const user_verify_1 = __importDefault(require("../middlewares/verify/user.verify"));
const auth_validator_1 = require("../middlewares/validators/auth-validator");
const authRouter = (0, express_1.Router)();
/**
 * @GET - routes
 */
// Verify user
authRouter.get("/verify", token_manager_1.verifyToken, auth_controllers_1.default.verifyUser);
/**
 * @POST - routes
 */
// Create a new guest user
authRouter.post("/guest", auth_validator_1.AuthValidator.validateNewUser, user_verify_1.default.verifyUsername, auth_controllers_1.default.createGuestUser);
//Create a new email user.
authRouter.post("/email", auth_validator_1.AuthValidator.validateNewUser, user_verify_1.default.verifyUsername, user_verify_1.default.verifyEmail, auth_controllers_1.default.createEmailUser);
// Login user.
authRouter.post("/login", auth_validator_1.AuthValidator.validateLoginCredentials, auth_controllers_1.default.loginUser);
// Logout user.
authRouter.post("/logout", auth_controllers_1.default.logoutUser);
exports.default = authRouter;
//# sourceMappingURL=auth-route.js.map