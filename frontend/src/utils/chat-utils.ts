import { LastChatType } from "@/types/chat.type";

/**
 * Utility class for chat-related operations.
 */
export default class ChatUtils {
  /**
   * Sorts an array of LastChatType objects based on the sentAt property in descending order.
   * @param chats - The array of LastChatType objects to be sorted.
   * @returns The sorted array of LastChatType objects.
   */
  public static sortLastChat = (chats: LastChatType[]) => {
    return chats.sort((a, b) => {
      return (
        new Date(b.lastChat.sentAt).getTime() -
        new Date(a.lastChat.sentAt).getTime()
      );
    });
  };

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
  public static etUserIdsFromChatId = (
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
