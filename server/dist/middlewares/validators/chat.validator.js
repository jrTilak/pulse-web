"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
class ChatValidator {
    static chatSchema = zod_1.z.object({
        sentBy: zod_1.z.string(),
        sentAt: zod_1.z.string().default(new Date().toISOString()),
        sentTo: zod_1.z.string(),
        isSeen: zod_1.z.boolean().default(false),
        repliedTo: zod_1.z.string().optional(),
        isDeleted: zod_1.z.boolean().default(false),
        seenAt: zod_1.z.string().optional().nullable(),
        data: zod_1.z.object({
            content: zod_1.z.string().min(1),
            _type: zod_1.z.enum(["text", "image", "video", "audio", "file"]),
            caption: zod_1.z.string().optional(),
        }),
        _id: zod_1.z.string().optional(),
    });
    static validateChat = (data) => {
        return ChatValidator.chatSchema.safeParse(data);
    };
}
exports.default = ChatValidator;
//# sourceMappingURL=chat.validator.js.map