import { Request, Response, NextFunction } from "express";
import { ErrorResponseType, SuccessResponseType } from "../types/response";

/**
 * ResponseController class handles various types of responses in the application.
 */
export default class ResponseController {
  /**
   * Handles response error by sending an error response with the specified status code and error object.
   * @param res The response object.
   * @param error The error object containing status code, message, and errors.
   * @returns The response with the error object.
   */
  public static HandleResponseError(res: Response, error: ErrorResponseType) {
    return res.status(error.status).json(error);
  }

  /**
   * Handles 500 error by sending an error response with status code 500 and the specified errors.
   * @param res The response object.
   * @param errors The array of errors.
   * @returns The response with the error object.
   */
  public static Handle500Error(res: Response, errors: []) {
    const response: ErrorResponseType = {
      status: 500,
      message: "Error occurred. Try Again!",
      errors: errors,
    };
    return res.status(response.status).json(response);
  }

  public static Handle404Error(res: Response, errors: []) {
    const response: ErrorResponseType = {
      status: 404,
      message: "Not found!",
      errors: errors,
    };
    return res.status(response.status).json(response);
  }

  /**
   * Handles unauthorized error by sending a JSON response with status 401 and error details.
   * @param res - The response object.
   * @param errors - An array of error messages.
   * @returns The response object with status 401 and error details.
   */
  public static HandleUnauthorizedError(res: Response, errors: []) {
    const response: ErrorResponseType = {
      status: 401,
      message: "Unauthorized",
      errors: errors,
    };
    return res.status(response.status).json(response);
  }

  /**
   * Handles unprocessable entity error by sending an error response with status code 422 and the specified errors.
   * @param res The response object.
   * @param errors The array of errors.
   * @returns The response with the error object.
   */
  public static HandleUnprocessableEntityError(res: Response, errors: []) {
    const response: ErrorResponseType = {
      status: 422,
      message: "Invalid input data!",
      errors: errors,
    };
    return res.status(response.status).json(response);
  }

  /**
   * Handles success response by sending a response with the specified status code and response object.
   * @param res The response object.
   * @param resObj The success response object.
   * @returns The response with the success response object.
   */
  public static HandleSuccessResponse(
    res: Response,
    resObj: SuccessResponseType
  ) {
    return res.status(resObj.status).json(resObj);
  }
}
