"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const reponse_controllers_1 = __importDefault(require("../controllers/reponse-controllers"));
/**
 * Creates a token with the given ID and expiration time.
 * @param id - The ID to be included in the token payload.
 * @param expiresIn - The expiration time for the token.
 * @returns The generated token.
 */
const createToken = (id, expiresIn) => {
    const payload = { id };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
};
exports.createToken = createToken;
/**
 * Verifies the authenticity of a token.
 * If the token is valid, it sets the decoded token data in `res.locals.jwtData` and calls the `next` middleware.
 * If the token is invalid or expired, it sends an error response with the appropriate status code.
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction.
 * @returns A Promise that resolves if the token is valid, or rejects with an error message if the token is invalid or expired.
 */
const verifyToken = async (req, res, next) => {
    const token = req.signedCookies[process.env.AUTH_TOKEN_ID];
    if (!token || token.trim() === "") {
        const response = {
            status: 401,
            message: "Auth Error, Cookies not found",
            errors: [],
        };
        return res.status(response.status).json(response);
    }
    return new Promise((resolve, reject) => {
        return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, success) => {
            if (err) {
                reject(err.message);
                return reponse_controllers_1.default.HandleResponseError(res, {
                    status: 401,
                    message: "Token Expired, Please login again!",
                    errors: [],
                });
            }
            else {
                resolve();
                res.locals.jwtData = success;
                return next();
            }
        });
    });
};
exports.verifyToken = verifyToken;
// export const verifyTokenOnWs = (token: string) => {
//   if (!token || token.trim() === "") {
//     return Promise.resolve(false);
//   }
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
//       if (success) {
//         resolve(true);
//       } else {
//         resolve(false);
//       }
//     });
//   });
// };
//# sourceMappingURL=token-manager.js.map