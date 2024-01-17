import { Router } from "express";
import FileController from "../controllers/file-controllers";
import { verifyToken } from "../utils/token-manager";
import FileValidator from "../middlewares/validators/file-validator";

const fileRouter = Router();

/**
 * @GET - routes
 */

// Get a file
fileRouter.get("/:id", FileController.getFile);

/**
 * @POST - routes
 */
// Upload a file
fileRouter.post(
  "/upload",
  verifyToken,
  FileValidator.validateFileToUpload,
  FileController.upload
);

export default fileRouter;
