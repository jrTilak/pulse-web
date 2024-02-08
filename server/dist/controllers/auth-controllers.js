"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const User_1 = __importDefault(require("../schema/User"));
const UserAuth_1 = __importDefault(require("../schema/UserAuth"));
const UserPrivateInfo_1 = __importDefault(require("../schema/UserPrivateInfo"));
const reponse_controllers_1 = __importDefault(require("./reponse-controllers"));
const cookie_handlers_1 = require("../utils/cookie-handlers");
const const_1 = require("../utils/const");
/**
 * Controller class for user authentication related operations.
 */
class UserAuthController {
    /**
     * Creates a guest user.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A success response with the created user data or a 500 error response.
     */
    static createGuestUser = async (req, res) => {
        try {
            const { username, name } = req.body;
            const newUser = new User_1.default({
                username,
                name,
            });
            await newUser.save();
            const userAuth = new UserAuth_1.default({
                userId: newUser._id,
                method: "guest",
            });
            await userAuth.save();
            const userPrivateInfo = new UserPrivateInfo_1.default({
                userId: newUser._id,
            });
            await userPrivateInfo.save();
            // Register cookies
            cookie_handlers_1.CookieHandler.registerCookies(res, newUser._id.toString());
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 201,
                message: "Account created successfully!",
                data: newUser,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Creates a new user with email authentication method.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A success response with the created user data or a 500 error response.
     */
    static createEmailUser = async (req, res) => {
        try {
            const { username, name, email, password } = req.body;
            const newUser = new User_1.default({
                username,
                name,
            });
            await newUser.save();
            const userAuth = new UserAuth_1.default({
                userId: newUser._id,
                method: "email",
                email,
                password: await (0, bcrypt_1.hash)(password, const_1.PASSWORD_SALT_ROUNDS),
            });
            await userAuth.save();
            const userPrivateInfo = new UserPrivateInfo_1.default({
                userId: newUser._id,
            });
            await userPrivateInfo.save();
            // Register cookies
            cookie_handlers_1.CookieHandler.registerCookies(res, newUser._id.toString());
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 201,
                message: "Account created successfully!",
                data: newUser,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Logs in a user with email authentication method.
     *
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the response object or rejects with an error response.
     */
    static loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;
            const userAuth = await UserAuth_1.default.findOne({ email: email });
            // Check if user exists
            if (!userAuth) {
                return reponse_controllers_1.default.HandleResponseError(res, {
                    status: 404,
                    message: "User not found, Please create an account!",
                    errors: [],
                });
            }
            const isPasswordValid = await (0, bcrypt_1.compare)(password, userAuth.password.toString() || "");
            // Check if password is valid
            if (!isPasswordValid) {
                return reponse_controllers_1.default.HandleResponseError(res, {
                    status: 401,
                    message: "Invalid credentials!",
                    errors: [],
                });
            }
            // Register cookies
            cookie_handlers_1.CookieHandler.registerCookies(res, userAuth.userId.toString());
            //return user data
            const user = await User_1.default.findById(userAuth.userId);
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Login successful!",
                data: user,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Verifies the user by checking the user token stored in the cookies.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A promise that resolves to the response object or rejects with an error response.
     */
    static verifyUser = async (req, res) => {
        try {
            // Check if user exists
            // res.locals.jwtData.id is the user id from the jwt token returned by the auth middleware called verifyToken
            const user = await User_1.default.findById(res.locals.jwtData.id);
            if (!user) {
                return reponse_controllers_1.default.HandleResponseError(res, {
                    status: 404,
                    message: "User not found!",
                    errors: [],
                });
            }
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "User verified!",
                data: user,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Logout user.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A success response with status 200 and an empty data object.
     */
    static logoutUser = async (req, res) => {
        try {
            //logout user
            cookie_handlers_1.CookieHandler.clearCookies(res);
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "Logout successful!",
                data: {},
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
}
exports.default = UserAuthController;
//# sourceMappingURL=auth-controllers.js.map