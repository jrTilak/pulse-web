import { z } from "zod";
/**
 * Represents a ChatValidator class that provides validation for chat data.
 */
export default class ChatValidator {
  /**
   * The chat schema for validating chat data.
   */
  public static chatSchema = z.object({
    sentBy: z.string(),
    sentAt: z.string().default(new Date().toISOString()),
    sentTo: z.string(),
    isSeen: z.boolean().default(false),
    repliedTo: z.string().optional(),
    isDeleted: z.boolean().default(false),
    seenAt: z.string().optional().nullable(),
    data: z.object({
      content: z.string().min(1),
      _type: z.enum(["text", "image", "video", "audio", "file"]),
      caption: z.string().optional(),
    }),
    _id: z.string().optional(),
  });

  /**
   * Validates the chat data using the chat schema.
   * @param data The chat data to be validated.
   * @returns The result of the validation.
   */
  public static validateChat = (data: ChatType) => {
    return ChatValidator.chatSchema.safeParse(data);
  };
}
//types
export type ChatType = z.infer<typeof ChatValidator.chatSchema> & {
  _id?: string;
};
