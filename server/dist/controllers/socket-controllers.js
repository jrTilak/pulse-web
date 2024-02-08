"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketConnection = void 0;
const Chat_1 = __importDefault(require("../schema/Chat"));
// import { verifyTokenOnWs } from "../utils/token-manager";
const UserPrivateInfo_1 = __importDefault(require("../schema/UserPrivateInfo"));
const User_1 = __importDefault(require("../schema/User"));
const Files_1 = __importDefault(require("../schema/Files"));
const chat_validator_1 = __importDefault(require("../middlewares/validators/chat-validator"));
const mongoose_1 = __importDefault(require("mongoose"));
const handleSocketConnection = async (io) => {
    io.on("connection", async (socket) => {
        //get jwt token from http only cookie
        // const auth_token = socket.handshake.headers.cookie
        //   .split(";")
        //   .find((c) => c.trim().startsWith("auth_token="))
        //   .split("=")[1];
        // // console.log(auth_token, "connected");
        // const isVerified = await verifyTokenOnWs(auth_token);
        // if (!isVerified) {
        //   console.log("Invalid token", auth_token);
        //   socket.emit("error", { success: false, message: "Invalid token" });
        //   return socket.disconnect();
        // }
        const userId = socket.handshake.query.userId;
        if (userId == undefined) {
            console.log("Invalid userId", userId);
            socket.emit("error", { success: false, message: "Invalid userId" });
            return socket.disconnect();
        }
        await User_1.default.findByIdAndUpdate(userId, { isOnline: true });
        //connect to room
        socket.join(userId);
        console.log("Client connected", userId);
        socket.on("send-message", async (data, ack) => {
            const isValid = chat_validator_1.default.validateChat(data);
            if (!isValid.success) {
                console.log("Error occurred");
                socket.emit("error", isValid);
                return;
            }
            //save data to db
            const message = isValid.data;
            const chats = await Chat_1.default.findOne({
                participants: { $all: [message.sentBy, message.sentTo] },
            });
            if (chats) {
                chats.chats.push(message);
                await chats.save();
                const chat = chats.chats[chats.chats.length - 1];
                socket.broadcast.to(isValid.data.sentTo).emit("receive-message", chat);
                ack(chat);
            }
            else {
                const sender = await UserPrivateInfo_1.default.findOne({
                    userId: message.sentBy,
                });
                const receiver = await UserPrivateInfo_1.default.findOne({
                    userId: message.sentTo,
                });
                sender.connectedUsers.push(new mongoose_1.default.Types.ObjectId(message.sentTo));
                receiver.connectedUsers.push(new mongoose_1.default.Types.ObjectId(message.sentBy));
                const newChat = new Chat_1.default({
                    participants: [message.sentBy, message.sentTo],
                    chats: [message],
                });
                await newChat.save();
                await sender.save();
                await receiver.save();
                const chat = newChat.chats[newChat.chats.length - 1];
                socket.broadcast.to(isValid.data.sentTo).emit("receive-message", chat);
                ack(chat);
            }
        });
        socket.on("user-typing", (data) => {
            socket.broadcast.to(data.sentTo).emit("user-typing", data);
        });
        socket.on("delete-message", async (data, ack) => {
            const isValid = chat_validator_1.default.validateChat(data);
            if (!isValid.success) {
                console.log("Error occurred");
                socket.emit("error", isValid);
                return;
            }
            //save data to db
            const message = isValid.data;
            const chats = await Chat_1.default.findOne({
                participants: { $all: [message.sentBy, message.sentTo] },
            });
            if (!chats) {
                return ack(null);
            }
            const index = chats.chats.findIndex((chat) => {
                if (chat._id)
                    return chat._id.toString() === message._id;
            });
            if (chats.chats[index].data._type !== "text") {
                //delete file
                await Files_1.default.findByIdAndDelete(chats.chats[index].data.content);
            }
            chats.chats[index].isDeleted = true;
            chats.chats[index].data.content = "This message was deleted";
            chats.chats[index].data.caption = "";
            await chats.save();
            socket.broadcast.to(isValid.data.sentTo).emit("delete-message", {
                ...isValid.data,
                isDeleted: true,
            });
            ack(isValid.data._id);
            return;
        });
        socket.on("mark-as-seen", async (data, ack) => {
            const chats = await Chat_1.default.findOne({
                participants: { $all: [data.sentBy, data.sentTo] },
            });
            if (!chats) {
                return;
            }
            const index = chats.chats.findIndex((chat) => {
                if (chat._id)
                    return chat._id.toString() === data.messageId;
            });
            chats.chats[index].isSeen = true;
            chats.chats[index].seenAt = new Date().toISOString();
            await chats.save();
            socket.broadcast
                .to(data.sentTo)
                .emit("message-seen", { ...data, seenAt: new Date().toISOString() });
            ack(true);
        });
        //audio video call
        socket.on("call-user", (data) => {
            socket.broadcast.to(data.userToCall).emit("call-user", {
                signal: data.signalData,
                from: data.from,
                name: data.name,
            });
        });
        socket.on("answer-call", (data) => {
            socket.broadcast.to(data.to).emit("call-accepted", data.signal);
        });
        socket.on("reject-call", (data) => {
            socket.broadcast.to(data.to).emit("call-rejected", data.signal);
        });
        socket.on("end-call", (data) => {
            socket.broadcast.to(data.to).emit("call-ended", data.signal);
        });
        socket.on("disconnect", async () => {
            await User_1.default.findByIdAndUpdate(userId, {
                isOnline: false,
                lastSeen: new Date().toISOString(),
            });
            console.log("Client disconnected", userId);
        });
    });
};
exports.handleSocketConnection = handleSocketConnection;
//# sourceMappingURL=socket-controllers.js.map