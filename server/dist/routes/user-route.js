"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_manager_1 = require("../utils/token-manager");
const user_controllers_1 = __importDefault(require("../controllers/user-controllers"));
const user_validators_1 = __importDefault(require("../middlewares/validators/user.validators"));
const userRouter = (0, express_1.Router)();
/**
 * @GET -routes
 */
userRouter.get("/u/:username", user_controllers_1.default.getUserByUsername);
userRouter.get("/id/:id", user_controllers_1.default.getUserById);
userRouter.get("/all", user_controllers_1.default.getAllUsers);
userRouter.get("/followers", token_manager_1.verifyToken, user_controllers_1.default.getFollowersList);
userRouter.get("/following", token_manager_1.verifyToken, user_controllers_1.default.getFollowingList);
userRouter.get("/suggested-users", token_manager_1.verifyToken, user_controllers_1.default.getSuggestedUsers);
/**
 * @POST -routes
 */
userRouter.post("/u/:username/follow", token_manager_1.verifyToken, user_controllers_1.default.followUser);
/**
 * @PUT -routes
 */
userRouter.put("/edit", token_manager_1.verifyToken, user_validators_1.default.validateEditUserDetails, user_controllers_1.default.editUserDetails);
/**
 * @DELETE -routes
 */
userRouter.delete("/u/:username/follow", token_manager_1.verifyToken, user_controllers_1.default.followUser);
exports.default = userRouter;
//# sourceMappingURL=user-route.js.map