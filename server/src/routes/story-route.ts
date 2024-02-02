import { Router } from "express";
import { verifyToken } from "../utils/token-manager";
import StoryController from "../controllers/story-controllers";

const storyRouter = Router();

/**
 * @GET - routes
 */
storyRouter.get("/id/:storyId", StoryController.getStoryById);
storyRouter.get("/following", StoryController.getFollowingStories);

/**
 * @POST - routes
 */
storyRouter.post(
  "/new/story/:type",
  verifyToken,
  StoryController.createNewStory
);

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
