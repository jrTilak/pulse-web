/**
 * Utility class for chat-related operations.
 */
export default class ChatUtils {
  /**
   * Creates a chat ID by concatenating the user IDs with a separator.
   * @param userId1 - The first user ID.
   * @param userId2 - The second user ID.
   * @returns The chat ID.
   */
  public static createChatId(userId1: string, userId2: string) {
    // Ensure the order of IDs is consistent
    const ids = [userId1, userId2].sort();

    // Concatenate the IDs with a separator
    const chatId = ids.join("_");

    return chatId;
  }

  /**
   * Extracts the user IDs from a chat ID.
   * @param chatId - The chat ID.
   * @param currentUserId - The ID of the current user.
   * @returns An object containing the current user ID and the other user ID, or null if the chat ID is invalid.
   */
  public static getUserIdsFromChatId = (
    chatId: string,
    currentUserId: string
  ) => {
    const ids = chatId.split("_");
    const otherUserId = ids.find((id) => id !== currentUserId);
    const currentUserIdFromChatId = ids.find((id) => id === currentUserId);
    if (currentUserIdFromChatId !== currentUserId || !otherUserId) return null;
    return { currentUserId, otherUserId };
  };
}
