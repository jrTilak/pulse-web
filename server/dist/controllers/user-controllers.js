"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../schema/User"));
const UserPrivateInfo_1 = __importDefault(require("../schema/UserPrivateInfo"));
const reponse_controllers_1 = __importDefault(require("./reponse-controllers"));
const obj_utils_1 = __importDefault(require("../utils/obj-utils"));
const mongoose_1 = __importDefault(require("mongoose"));
// import agenda from "./agenda-event-controllers";
class UserController {
    /**
     * Retrieves a user by their username.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A success response with the user data if found, or a 404 error response if not found.
     */
    static getUserByUsername = async (req, res) => {
        const user = await User_1.default.findOne({ username: req.params.username });
        if (!user) {
            reponse_controllers_1.default.Handle404Error(res, []);
        }
        return reponse_controllers_1.default.HandleSuccessResponse(res, {
            status: 200,
            message: "User found",
            data: user,
        });
    };
    /**
     * Edits the details of a user.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the updated user details.
     */
    static editUserDetails = async (req, res) => {
        try {
            const body = req.body;
            const cannotUpdate = ["_id", "createdAt", "__v"];
            if (Object.keys(body).some((key) => cannotUpdate.includes(key))) {
                return reponse_controllers_1.default.HandleResponseError(res, {
                    status: 400,
                    message: "Cannot update these fields " + cannotUpdate.join(", "),
                    errors: [],
                });
            }
            const exceptions = ["socialLinks"];
            //check if body has any key other than exceptions
            if (!Object.keys(body).some((key) => exceptions.includes(key))) {
                const user = await User_1.default.findOneAndUpdate({ _id: res.locals.jwtData.id }, body, {
                    new: true,
                });
                if (!user) {
                    return reponse_controllers_1.default.Handle404Error(res, []);
                }
                return reponse_controllers_1.default.HandleSuccessResponse(res, {
                    status: 200,
                    message: "User updated",
                    data: user,
                });
            }
            else {
                //if body has socialLinks
                const userToFollow = await User_1.default.findOne({ _id: res.locals.jwtData.id });
                //check if newUser.socialLinks has length more than 5 and any links are repeated
                const socialLinks = [
                    ...userToFollow.socialLinks,
                    ...body.socialLinks,
                ];
                const links = socialLinks.map((link) => link.url);
                const uniqueLinks = [...new Set(links)];
                if (uniqueLinks.length !== links.length) {
                    return reponse_controllers_1.default.HandleResponseError(res, {
                        status: 400,
                        message: "Link already exists, Try another one",
                        errors: [],
                    });
                }
                if (socialLinks.length > 5) {
                    return reponse_controllers_1.default.HandleResponseError(res, {
                        status: 400,
                        message: "Cannot add more than 5 links",
                        errors: [],
                    });
                }
                const updatedUser = await User_1.default.findOneAndUpdate({ _id: res.locals.jwtData.id }, {
                    ...body,
                    socialLinks,
                }, {
                    new: true,
                });
                return reponse_controllers_1.default.HandleSuccessResponse(res, {
                    status: 200,
                    message: "User updated",
                    data: updatedUser,
                });
            }
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Handles the logic for following or unfollowing a user.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A response indicating the success or failure of the operation.
     */
    static followUser = async (req, res) => {
        try {
            const userToFollow = await User_1.default.findOne({
                username: req.params.username,
            });
            const user = await User_1.default.findOne({ _id: res.locals.jwtData.id });
            const isToFollow = req.method === "POST";
            if (!userToFollow || !user) {
                return reponse_controllers_1.default.Handle404Error(res, []);
            }
            if (userToFollow._id.toString() === res.locals.jwtData.id) {
                return reponse_controllers_1.default.HandleResponseError(res, {
                    status: 400,
                    message: "Cannot follow yourself",
                    errors: [],
                });
            }
            const userToFollowPrivateInfo = await UserPrivateInfo_1.default.findOne({
                userId: userToFollow._id,
            });
            const userPrivateInfo = await UserPrivateInfo_1.default.findOne({
                userId: user._id,
            });
            //add userToFollow to user's following list
            if (isToFollow) {
                userPrivateInfo.following.push(userToFollow._id);
                userToFollowPrivateInfo.followers.push(user._id);
                await userPrivateInfo.save();
                await userToFollowPrivateInfo.save();
            }
            else {
                userPrivateInfo.following = userPrivateInfo.following.filter((userId) => userId !== userToFollow._id);
                userToFollowPrivateInfo.followers =
                    userToFollowPrivateInfo.followers.filter((userId) => userId !== user._id);
                await userPrivateInfo.save();
                await userToFollowPrivateInfo.save();
            }
            user.following = userPrivateInfo.following.length;
            userToFollow.followers = userToFollowPrivateInfo.followers.length;
            await user.save();
            await userToFollow.save();
            const users = {
                user,
                userToFollow,
            };
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: isToFollow ? "Followed" : "Unfollowed",
                data: users,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Retrieves the list of followers id for the authenticated user.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A success response with the list of followers or an error response if an error occurs.
     */
    static getFollowersList = async (req, res) => {
        try {
            const userPrivateInfo = await UserPrivateInfo_1.default.findOne({
                userId: res.locals.jwtData.id,
            });
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Followers found",
                data: userPrivateInfo.followers,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Retrieves the list of users that the current user is following.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A success response with the list of following users.
     */
    static getFollowingList = async (req, res) => {
        try {
            const userPrivateInfo = await UserPrivateInfo_1.default.findOne({
                userId: res.locals.jwtData.id,
            });
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Following found",
                data: userPrivateInfo.following,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Retrieves a user by their ID.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the user data or an error response.
     */
    static getUserById = async (req, res) => {
        const qs = req.query.q;
        try {
            const user = await User_1.default.findOne({ _id: req.params.id });
            if (!user) {
                return reponse_controllers_1.default.Handle404Error(res, []);
            }
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "User found",
                data: qs == undefined
                    ? obj_utils_1.default.saveOnlyTheseKeys(user, qs.split(","))
                    : user,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Retrieves all users.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A response indicating the success or failure of the operation.
     */
    static getAllUsers = async (req, res) => {
        try {
            const { neglectUsers: q } = req.query;
            console.log(q);
            const neglectUsers = String(q || "").split(",");
            const users = await User_1.default.find({
                _id: {
                    $nin: neglectUsers.map((id) => new mongoose_1.default.Types.ObjectId(id)),
                },
            });
            console.log(users.map((user) => user.username));
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Users found",
                data: users,
            });
        }
        catch (error) {
            console.log(error);
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Retrieves a list of suggested users based on the current user's preferences.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A response with the suggested users.
     */
    static getSuggestedUsers = async (req, res) => {
        try {
            const user = await UserPrivateInfo_1.default.findOne({
                userId: new mongoose_1.default.Types.ObjectId(res.locals.jwtData.id),
            });
            const suggestedUsers = await User_1.default.find({
                _id: { $nin: [...user.following, user.userId] },
            }).limit(5);
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Suggested users found",
                data: suggestedUsers,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
}
exports.default = UserController;
//# sourceMappingURL=user-controllers.js.map