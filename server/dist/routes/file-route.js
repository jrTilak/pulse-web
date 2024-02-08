"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const file_controllers_1 = __importDefault(require("../controllers/file-controllers"));
const token_manager_1 = require("../utils/token-manager");
const file_validators_1 = __importDefault(require("../middlewares/validators/file-validators"));
const fileRouter = (0, express_1.Router)();
/**
 * @GET - routes
 */
// Get a file
fileRouter.get("/:id", file_controllers_1.default.getFile);
/**
 * @POST - routes
 */
// Upload a file
fileRouter.post("/upload", token_manager_1.verifyToken, file_validators_1.default.validateFileToUpload, file_controllers_1.default.upload);
exports.default = fileRouter;
//# sourceMappingURL=file-route.js.map