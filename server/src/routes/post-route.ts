import { Router } from "express";
import { verifyToken } from "../utils/token-manager";
import { PostController } from "../controllers/post-controllers";
import { PostValidator } from "../middlewares/validators/post-validator";

const postRouter = Router();

/**
 * @GET - routes
 */

postRouter.get("/:username/all", PostController.getAllPosts);
postRouter.get("/relevant", verifyToken, PostController.getRelevantPost);
postRouter.get(
  "/:username/saved-posts",
  verifyToken,
  PostController.getSavedPosts
);
postRouter.get("/id/:postId", PostController.getPostById);

/**
 * @POST - routes
 */
postRouter.post(
  "/new",
  verifyToken,
  PostValidator.validatePost,
  PostController.createNewPost
);
postRouter.post(
  "/draft",
  verifyToken,
  PostValidator.validateDraft,
  PostController.createDraft
);
postRouter.post(
  "/:postId/comment",
  verifyToken,
  PostValidator.validateComment,
  PostController.addComment
);
postRouter.post("/:postId/pin", verifyToken, PostController.togglePinPost);
postRouter.post("/:postId/save", verifyToken, PostController.toggleSavePost);

postRouter.post("/:postId/like", verifyToken, PostController.toggleLikePost);

/**
 * @DELETE - routes
 */
postRouter.delete("/:postId", verifyToken, PostController.deletePost);
postRouter.delete("/:postId/pin", verifyToken, PostController.togglePinPost);
postRouter.delete("/:postId/save", verifyToken, PostController.toggleSavePost);
postRouter.delete("/:postId/like", verifyToken, PostController.toggleLikePost);

export default postRouter;
