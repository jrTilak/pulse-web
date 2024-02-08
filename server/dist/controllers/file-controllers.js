"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Files_1 = __importDefault(require("../schema/Files"));
const reponse_controllers_1 = __importDefault(require("./reponse-controllers"));
/**
 * Controller class for handling file-related operations.
 */
class FileController {
    /**
     * Uploads a file to the database.
     * @param req - The request object.
     * @param res - The response object.
     * @returns A Promise that resolves to the response with the file ID.
     */
    static upload = async (req, res) => {
        try {
            //save file to database
            const file = await Files_1.default.create({
                ...req.body,
                createdBy: res.locals.jwtData.id,
            });
            //return response with file ID only
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "File uploaded successfully!",
                data: { _id: file._id.toString() },
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
    /**
     * Retrieves a file from the database.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next function.
     * @returns A Promise that resolves to the response with the file content.
     */
    static getFile = async (req, res, next) => {
        try {
            //get file from database
            const file = await Files_1.default.findById(req.params.id);
            //return response with file content
            return reponse_controllers_1.default.HandleSuccessResponse(res, {
                status: 200,
                message: "File retrieved successfully!",
                data: file,
            });
        }
        catch (error) {
            return reponse_controllers_1.default.Handle500Error(res, error);
        }
    };
}
exports.default = FileController;
//# sourceMappingURL=file-controllers.js.map