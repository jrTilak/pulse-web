"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const Post_1 = __importDefault(require("../schema/Post"));
const User_1 = __importDefault(require("../schema/User"));
const Draft_1 = __importDefault(require("../schema/Draft"));
const UserPrivateInfo_1 = __importDefault(require("../schema/UserPrivateInfo"));
const reponse_controllers_1 = __importDefault(require("./reponse-controllers"));
const post_utils_1 = __importDefault(require("../utils/post-utils"));
const mongoose_1 = __importDefault(require("mongoose"));
const shuffle_array_1 = __importDefault(require("shuffle-array"));
class PostController {
    /**
     * Creates a new post.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the created post.
     */
    static createNewPost = async (req, res) => {
        try {
            const { content } = req.body;
            const user = await User_1.default.findOne({ _id: res.locals.jwtData.id });
            const newPost = new Post_1.default({
                content,
                createdBy: user._id,
            });
            await newPost.save();
            // update user's posts in User schema
            await User_1.default.findOneAndUpdate({ _id: user._id }, { $push: { posts: newPost._id } }, { new: true });
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Post created successfully!",
                data: newPost,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Retrieves all posts created by a specific user.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A response with the user's posts.
     */
    static getAllPosts = async (req, res) => {
        try {
            const user = await User_1.default.findOne({ username: req.params.username });
            if (!user) {
                reponse_controllers_1.default.Handle404Error(res, []);
            }
            const posts = await Post_1.default.find({ createdBy: user._id });
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Posts found!",
                data: post_utils_1.default.appendUserAndSortPost(posts, user),
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Creates a new draft post.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns The response with the created draft post.
     */
    static createDraft = async (req, res) => {
        try {
            const { content } = req.body;
            const newDraft = new Draft_1.default({
                content,
                createdBy: res.locals.jwtData.id,
            });
            await newDraft.save();
            await UserPrivateInfo_1.default.findOneAndUpdate({ userId: res.locals.jwtData.id }, { $push: { drafts: newDraft._id } }, { new: true });
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Draft created successfully!",
                data: newDraft,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Retrieves the saved posts id for the authenticated user.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A success response with the saved posts data or an error response.
     */
    static getSavedPosts = async (req, res) => {
        try {
            const userId = new mongoose_1.default.Types.ObjectId(res.locals.jwtData.id);
            const userPrivateInfo = await UserPrivateInfo_1.default.findOne({
                userId,
            });
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Posts found!",
                data: userPrivateInfo?.savedPosts || [],
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Deletes a post.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A response indicating the success or failure of the operation and the updated user.
     */
    static deletePost = async (req, res) => {
        try {
            const postId = req.params.postId;
            const post = await Post_1.default.findById(postId);
            if (!post) {
                return reponse_controllers_1.default.Handle404Error(res, []);
            }
            if (post.createdBy.toString() !== res.locals.jwtData.id) {
                return reponse_controllers_1.default.HandleUnauthorizedError(res, []);
            }
            await Post_1.default.findByIdAndDelete(postId);
            const user = await User_1.default.findOneAndUpdate({ _id: res.locals.jwtData.id }, { $pull: { posts: postId } }, { new: true });
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Post deleted successfully!",
                data: user,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Toggles the pin status of a post.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A promise that resolves to the updated post or an error response.
     */
    static togglePinPost = async (req, res) => {
        try {
            const postId = req.params.postId;
            const isToPin = req.method === "POST";
            const post = await Post_1.default.findById(postId);
            if (!post) {
                return reponse_controllers_1.default.Handle404Error(res, []);
            }
            if (post.createdBy.toString() !== res.locals.jwtData.id) {
                return reponse_controllers_1.default.HandleUnauthorizedError(res, []);
            }
            post.isPinned = isToPin;
            await post.save();
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Post pinned successfully!",
                data: post,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Toggles the save status of a post for the authenticated user.
     * If the post is already saved, it will be removed from the saved posts list.
     * If the post is not saved, it will be added to the saved posts list.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A success response with status 200 if the operation is successful, or a 500 error response if an error occurs.
     */
    static toggleSavePost = async (req, res) => {
        try {
            const postId = req.params.postId;
            const isToSave = req.method === "POST";
            await UserPrivateInfo_1.default.findOneAndUpdate({ userId: res.locals.jwtData.id }, isToSave
                ? { $addToSet: { savedPosts: postId } }
                : { $pull: { savedPosts: postId } }, { new: true });
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Post saved successfully!",
                data: {},
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Toggles the like status of a post.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A promise that resolves to the updated post or an error response.
     */
    static toggleLikePost = async (req, res) => {
        try {
            const postId = req.params.postId;
            const isToLike = req.method === "POST";
            const post = await Post_1.default.findByIdAndUpdate(postId, isToLike
                ? { $push: { likes: res.locals.jwtData.id } }
                : { $pull: { likes: res.locals.jwtData.id } }, { new: true });
            if (!post) {
                return reponse_controllers_1.default.Handle404Error(res, []);
            }
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Post liked successfully!",
                data: post,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Adds a comment to a post.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the updated post with the added comment.
     */
    static addComment = async (req, res) => {
        try {
            const { comment } = req.body;
            const newPost = await Post_1.default.findOneAndUpdate({ _id: req.params.postId }, {
                $push: {
                    comments: {
                        content: comment,
                        createdBy: res.locals.jwtData.id,
                        createdAt: Date.now(),
                    },
                },
            }, { new: true });
            if (!newPost) {
                return reponse_controllers_1.default.Handle404Error(res, []);
            }
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Comment added successfully!",
                data: newPost.comments,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Retrieves relevant posts based on the user's following list and random posts.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the response containing the relevant posts.
     */
    static getRelevantPostsId = async (req, res) => {
        const { neglect } = req.query;
        const toNeglect = neglect ? neglect.split(",") : [];
        try {
            const posts = await Post_1.default.find({
                _id: { $nin: toNeglect },
                createdBy: { $nin: res.locals.jwtData.id },
            });
            if (!posts) {
                return reponse_controllers_1.default.Handle404Error(res, []);
            }
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Posts found!",
                data: (0, shuffle_array_1.default)(posts.map((post) => post._id), { copy: true }).filter((_, index) => index < 10),
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Retrieves a post by id.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the response containing the post.
     */
    static getPostById = async (req, res) => {
        try {
            const post = (await Post_1.default.findById(req.params.postId)).toJSON();
            const user = (await User_1.default.findOne({ _id: post?.createdBy })).toJSON();
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Posts found!",
                data: post_utils_1.default.appendSingleUser(post, user),
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
}
exports.PostController = PostController;
//# sourceMappingURL=post-controllers.js.map