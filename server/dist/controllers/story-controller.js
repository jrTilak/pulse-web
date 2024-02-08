"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserStory_1 = __importDefault(require("../schema/UserStory"));
const User_1 = __importDefault(require("../schema/User"));
// import agenda from "./agenda-event-controllers";
const UserPrivateInfo_1 = __importDefault(require("../schema/UserPrivateInfo"));
const reponse_controllers_1 = __importDefault(require("./reponse-controllers"));
class StoryController {
    /**
     * Creates a new story.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the response object.
     */
    static createNewStory = async (req, res) => {
        try {
            const body = req.body;
            const user = await User_1.default.findOne({ _id: res.locals.jwtData.id });
            const storyTypes = ["text", "image", "video"];
            if (!storyTypes.includes(req.params.type)) {
                return reponse_controllers_1.default.HandleResponseError(res, {
                    status: 400,
                    message: "Invalid story type, Story type can be + " + storyTypes.join(", "),
                    errors: [],
                });
            }
            const newStory = new UserStory_1.default({
                createdBy: res.locals.jwtData.id,
                type: req.params.type,
                content: body.content,
                storyConfig: body.storyConfig,
            });
            await newStory.save();
            user.stories.push(newStory._id.toString());
            await user.save();
            //todo delete story after 24 hours
            // agenda.schedule("24 hours", "delete-story", {
            //   storyId: newStory._id,
            //   createdBy: newStory.createdBy,
            // });
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Story created",
                data: newStory,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Retrieves a story by its ID.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the response containing the story.
     */
    static getStoryById = async (req, res) => {
        try {
            const story = await UserStory_1.default.findById(req.params.storyId);
            if (!story) {
                return reponse_controllers_1.default.Handle404Error(res, []);
            }
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Story found",
                data: story,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Deletes a story by its ID.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A response indicating the success or failure of the operation.
     */
    static deleteStoryById = async (req, res) => {
        try {
            const story = await UserStory_1.default.findById(req.params.storyId);
            if (!story) {
                return reponse_controllers_1.default.Handle404Error(res, []);
            }
            if (res.locals.jwtData.id !== story.createdBy) {
                return reponse_controllers_1.default.HandleUnauthorizedError(res, []);
            }
            await story.deleteOne();
            await User_1.default.findByIdAndUpdate(story.createdBy, {
                $pull: { stories: story._id },
            });
            //todo Cancel the scheduled job
            // agenda.cancel({ name: "delete-story", "data.storyId": story._id });
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Story deleted successfully",
                data: null,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Updates the view count of a story and returns the updated story.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the updated story or an error response.
     */
    static viewAStory = async (req, res) => {
        try {
            const story = await UserStory_1.default.findByIdAndUpdate(req.params.storyId, {
                $addToSet: { views: res.locals.jwtData.id },
            });
            if (!story) {
                return reponse_controllers_1.default.Handle404Error(res, []);
            }
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Story viewed successfully",
                data: story,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Like a story.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the updated story or an error response.
     */
    static likeAStory = async (req, res) => {
        try {
            const story = await UserStory_1.default.findByIdAndUpdate(req.params.storyId, {
                $addToSet: { likes: res.locals.jwtData.id },
            }, { new: true });
            if (!story) {
                return reponse_controllers_1.default.Handle404Error(res, []);
            }
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Story liked successfully",
                data: story,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Unlike a story.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A promise that resolves to the updated story or an error response.
     */
    static unlikeAStory = async (req, res) => {
        try {
            const story = await UserStory_1.default.findByIdAndUpdate(req.params.storyId, {
                $pull: { likes: res.locals.jwtData.id },
            }, { new: true });
            if (!story) {
                return reponse_controllers_1.default.Handle404Error(res, []);
            }
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Story unliked successfully",
                data: story,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Retrieves the stories created by the users that the current user is following.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A success response with the following stories.
     */
    static getFollowingStories = async (req, res) => {
        try {
            const user = await UserPrivateInfo_1.default.findOne({
                userId: res.locals.jwtData.id,
            });
            const followingStories = await UserStory_1.default.find({
                createdBy: { $in: user.following },
            });
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Following stories retrieved successfully",
                data: followingStories,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
}
exports.default = StoryController;
//# sourceMappingURL=story-controller.js.map