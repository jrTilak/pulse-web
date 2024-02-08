"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = require("mongoose");
const connectDB = () => {
    console.log("Connecting to MongoDB...");
    return new Promise(async (resolve, reject) => {
        try {
            await (0, mongoose_1.connect)(process.env.MONGODB_CONNECTION_STRING || "");
            resolve("MongoDB connected 😍");
        }
        catch (err) {
            reject("MongoDB connection failed 😭");
            console.log(err);
        }
    });
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    try {
        await (0, mongoose_1.disconnect)();
        console.log("MongoDB disconnected 😒");
    }
    catch (err) {
        console.log("MongoDB disconnection failed 😭");
        console.log(err);
    }
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=connection.js.map