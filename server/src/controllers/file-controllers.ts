import { Request, Response, NextFunction } from "express";
import Files from "../schema/Files";
import ResponseController from "./reponse-controllers";

/**
 * Controller class for handling file-related operations.
 */
export default class FileController {
  /**
   * Uploads a file to the database.
   * @param req - The request object.
   * @param res - The response object.
   * @returns A Promise that resolves to the response with the file ID.
   */
  public static upload = async (req: Request, res: Response) => {
    try {
      //save file to database
      const file = await Files.create({
        ...req.body,
        createdBy: res.locals.jwtData.id,
      });
      //return response with file ID only
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "File uploaded successfully!",
        data: { _id: file._id.toString() },
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };

  /**
   * Retrieves a file from the database.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function.
   * @returns A Promise that resolves to the response with the file content.
   */
  public static getFile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      //get file from database
      const file = await Files.findById(req.params.id);
      //return response with file content
      return ResponseController.HandleSuccessResponse(res, {
        status: 200,
        message: "File retrieved successfully!",
        data: file,
      });
    } catch (error) {
      return ResponseController.Handle500Error(res, error);
    }
  };
}
