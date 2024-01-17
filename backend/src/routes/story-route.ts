import { Router } from "express";
import { verifyToken } from "../utils/token-manager";
import StoryController from "../controllers/story-controller";

const storyRouter = Router();

/**
 * @GET - routes
 */
storyRouter.get("/id/:storyId", StoryController.getStoryById);
storyRouter.get("/following", StoryController.getFollowingStories);

/**
 * @PUT - routes
 */
storyRouter.put("/id/:storyId/view", verifyToken, StoryController.viewAStory);
storyRouter.put("/id/:storyId/like", verifyToken, StoryController.likeAStory);

/**
 * @DELETE - routes
 */
storyRouter.delete(
  "/id/:storyId",
  verifyToken,
  StoryController.deleteStoryById
);
storyRouter.delete(
  "/id/:storyId/like",
  verifyToken,
  StoryController.unlikeAStory
);

export default storyRouter;
