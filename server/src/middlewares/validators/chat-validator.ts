import { z } from "zod";

export default class ChatValidator {
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

  public static validateChat = (data: ChatType) => {
    return ChatValidator.chatSchema.safeParse(data);
  };
}
//types
export type ChatType = z.infer<typeof ChatValidator.chatSchema>;