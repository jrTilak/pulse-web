"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ResponseController class handles various types of responses in the application.
 */
class ResponseController {
    /**
     * Handles response error by sending an error response with the specified status code and error object.
     * @param res The response object.
     * @param error The error object containing status code, message, and errors.
     * @returns The response with the error object.
     */
    static HandleResponseError(res, error) {
        return res.status(error.status).json(error);
    }
    /**
     * Handles 500 error by sending an error response with status code 500 and the specified errors.
     * @param res The response object.
     * @param errors The array of errors.
     * @returns The response with the error object.
     */
    static Handle500Error(res, errors) {
        const response = {
            status: 500,
            message: "Error occurred. Try Again!",
            errors: errors,
        };
        return res.status(response.status).json(response);
    }
    static Handle404Error(res, errors) {
        const response = {
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
    static HandleUnauthorizedError(res, errors) {
        const response = {
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
    static HandleUnprocessableEntityError(res, errors) {
        const response = {
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
    static HandleSuccessResponse(res, resObj) {
        return res.status(resObj.status).json(resObj);
    }
}
exports.default = ResponseController;
//# sourceMappingURL=reponse-controllers.js.map