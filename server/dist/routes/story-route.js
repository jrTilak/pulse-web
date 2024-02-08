"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_manager_1 = require("../utils/token-manager");
const story_controllers_1 = __importDefault(require("../controllers/story-controllers"));
const storyRouter = (0, express_1.Router)();
/**
 * @GET - routes
 */
storyRouter.get("/id/:storyId", story_controllers_1.default.getStoryById);
storyRouter.get("/following", story_controllers_1.default.getFollowingStories);
/**
 * @POST - routes
 */
storyRouter.post("/new/story/:type", token_manager_1.verifyToken, story_controllers_1.default.createNewStory);
/**
 * @PUT - routes
 */
storyRouter.put("/id/:storyId/view", token_manager_1.verifyToken, story_controllers_1.default.viewAStory);
storyRouter.put("/id/:storyId/like", token_manager_1.verifyToken, story_controllers_1.default.likeAStory);
/**
 * @DELETE - routes
 */
storyRouter.delete("/id/:storyId", token_manager_1.verifyToken, story_controllers_1.default.deleteStoryById);
storyRouter.delete("/id/:storyId/like", token_manager_1.verifyToken, story_controllers_1.default.unlikeAStory);
exports.default = storyRouter;
//# sourceMappingURL=story-route.js.map