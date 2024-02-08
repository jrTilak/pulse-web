"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("./auth-route"));
const chat_route_1 = __importDefault(require("./chat-route"));
const post_route_1 = __importDefault(require("./post-route"));
const story_route_1 = __importDefault(require("./story-route"));
const file_route_1 = __importDefault(require("./file-route"));
const user_route_1 = __importDefault(require("./user-route"));
const appRouter = (0, express_1.Router)();
appRouter.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the API of Pulse Backend!",
    });
});
appRouter.use("/auth", auth_route_1.default);
appRouter.use("/chats", chat_route_1.default);
appRouter.use("/post", post_route_1.default);
appRouter.use("/story", story_route_1.default);
appRouter.use("/user", user_route_1.default);
appRouter.use("/file", file_route_1.default);
exports.default = appRouter;
//# sourceMappingURL=index.js.map