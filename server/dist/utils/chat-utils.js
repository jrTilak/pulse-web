"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChatId = void 0;
/**
 * Creates a chat ID by concatenating two user IDs with a separator.
 * The order of the user IDs is consistent to ensure the same chat ID is generated regardless of the order of the input IDs.
 *
 * @param userId1 - The first user ID.
 * @param userId2 - The second user ID.
 * @returns The generated chat ID.
 */
function createChatId(userId1, userId2) {
    // Ensure the order of IDs is consistent
    const ids = [userId1, userId2].sort();
    // Concatenate the IDs with a separator
    const chatId = ids.join("_");
    return chatId;
}
exports.createChatId = createChatId;
//# sourceMappingURL=chat-utils.js.map