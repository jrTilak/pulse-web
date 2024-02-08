"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieHandler = void 0;
const token_manager_1 = require("./token-manager");
/**
 * A utility class for handling cookies.
 */
class CookieHandler {
    /**
     * Handles cookies by clearing existing cookies and setting new ones.
     * @param res - The express.js response object.
     * @param userId - The user ID.
     */
    static registerCookies(res, userId) {
        // clear cookies
        CookieHandler.clearCookies(res);
        // set cookies
        const token = (0, token_manager_1.createToken)(userId, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie("auth_token", token, {
            path: "/",
            domain: process.env.FRONTEND_DOMAIN,
            expires: expires,
            httpOnly: true,
            signed: true,
            sameSite: "none",
            secure: true,
        });
    }
    /**
     * Clears the existing cookies.
     * @param res - The response object.
     */
    static clearCookies(res) {
        res.clearCookie("auth_token", {
            httpOnly: true,
            domain: process.env.FRONTEND_DOMAIN,
            signed: true,
            path: "/",
            sameSite: "none",
            secure: true,
        });
    }
}
exports.CookieHandler = CookieHandler;
//# sourceMappingURL=cookie-handlers.js.map