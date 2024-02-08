"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_manager_1 = require("../utils/token-manager");
const post_controllers_1 = require("../controllers/post-controllers");
const post_validator_1 = require("../middlewares/validators/post-validator");
const postRouter = (0, express_1.Router)();
/**
 * @GET - routes
 */
postRouter.get("/:username/all", post_controllers_1.PostController.getAllPosts);
postRouter.get("/relevant", token_manager_1.verifyToken, post_controllers_1.PostController.getRelevantPostsId);
postRouter.get("/:username/saved-posts", token_manager_1.verifyToken, post_controllers_1.PostController.getSavedPosts);
postRouter.get("/id/:postId", post_controllers_1.PostController.getPostById);
/**
 * @POST - routes
 */
postRouter.post("/new", token_manager_1.verifyToken, post_validator_1.PostValidator.validatePost, post_controllers_1.PostController.createNewPost);
postRouter.post("/draft", token_manager_1.verifyToken, post_validator_1.PostValidator.validateDraft, post_controllers_1.PostController.createDraft);
postRouter.post("/:postId/comment", token_manager_1.verifyToken, post_validator_1.PostValidator.validateComment, post_controllers_1.PostController.addComment);
postRouter.post("/:postId/pin", token_manager_1.verifyToken, post_controllers_1.PostController.togglePinPost);
postRouter.post("/:postId/save", token_manager_1.verifyToken, post_controllers_1.PostController.toggleSavePost);
postRouter.post("/:postId/like", token_manager_1.verifyToken, post_controllers_1.PostController.toggleLikePost);
/**
 * @DELETE - routes
 */
postRouter.delete("/:postId", token_manager_1.verifyToken, post_controllers_1.PostController.deletePost);
postRouter.delete("/:postId/pin", token_manager_1.verifyToken, post_controllers_1.PostController.togglePinPost);
postRouter.delete("/:postId/save", token_manager_1.verifyToken, post_controllers_1.PostController.toggleSavePost);
postRouter.delete("/:postId/like", token_manager_1.verifyToken, post_controllers_1.PostController.toggleLikePost);
exports.default = postRouter;
//# sourceMappingURL=post-route.js.map