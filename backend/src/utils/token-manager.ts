import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ErrorResponseType } from "../types/response";
import ResponseController from "../controllers/reponse-controllers";

/**
 * Creates a token with the given ID and expiration time.
 * @param id - The ID to be included in the token payload.
 * @param expiresIn - The expiration time for the token.
 * @returns The generated token.
 */
export const createToken = (id: string, expiresIn: string) => {
  const payload = { id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

/**
 * Verifies the authenticity of a token.
 * If the token is valid, it sets the decoded token data in `res.locals.jwtData` and calls the `next` middleware.
 * If the token is invalid or expired, it sends an error response with the appropriate status code.
 * @param req - The Express Request object.
 * @param res - The Express Response object.
 * @param next - The Express NextFunction.
 * @returns A Promise that resolves if the token is valid, or rejects with an error message if the token is invalid or expired.
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies[process.env.AUTH_TOKEN_ID];
  if (!token || token.trim() === "") {
    const response: ErrorResponseType = {
      status: 401,
      message: "Auth Error, Cookies not found",
      errors: [],
    };
    return res.status(response.status).json(response);
  }
  return new Promise<void>((resolve, reject) => {
    return jwt.verify(
      token,
      process.env.JWT_SECRET,
      (err: any, success: any) => {
        if (err) {
          reject(err.message);
          return ResponseController.HandleResponseError(res, {
            status: 401,
            message: "Token Expired, Please login again!",
            errors: [],
          });
        } else {
          resolve();
          res.locals.jwtData = success;
          return next();
        }
      }
    );
  });
};

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
