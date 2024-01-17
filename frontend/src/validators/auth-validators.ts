import { StringUtils } from "@/utils/string-utils";
import { z } from "zod";

/**
 * A class that provides validation schemas and methods for authentication related data.
 */
export class AuthValidator {
  /**
   * Schema for validating guest user data.
   */
  public static guestUserSchema = z.object({
    name: z
      .string({
        errorMap: () => ({
          message: "Name must be between 3 to 20 characters",
        }),
      })
      .min(3)
      .max(20),
    username: z.string().min(3).max(20).startsWith("guest_"),
    method: z.array(z.literal("guest")).default(["guest"]),
  });

  /**
   * Schema for validating email user data.
   */
  public static emailUserSchema = z.object({
    name: z
      .string({
        errorMap: () => ({
          message: "Name must be between 3 to 40 characters",
        }),
      })
      .min(3)
      .max(40),
    username: z.string().min(3).max(40),
    method: z.array(z.literal("email")).default(["email"]),
    email: z
      .string({
        errorMap: () => ({
          message: "Invalid email",
        }),
      })
      .email(),
    password: z
      .string({
        errorMap: () => ({
          message: "Password must be between 8 to 20 characters",
        }),
      })
      .min(8)
      .max(20),
  });

  /**
   * Schema for validating login credentials.
   */
  public static loginCredentialsSchema = z.object({
    email: z
      .string({
        errorMap: () => ({
          message: "Invalid email",
        }),
      })
      .email(),
    password: z
      .string({
        errorMap: () => ({
          message: "Password must be between 8 to 20 characters",
        }),
      })
      .min(8)
      .max(20),
  });

  /**
   * Validates guest user data.
   * @param name - The name of the guest user.
   * @returns The result of the validation.
   */
  public static validateGuestUser(name: string) {
    const data = AuthValidator.guestUserSchema.safeParse({
      name,
      username: StringUtils.makeUsername(name, "guest"),
    });
    return data;
  }

  /**
   * Validates email user data.
   * @param body - The data of the email user.
   * @returns The result of the validation.
   */
  public static validateEmailUser(body: EmailUserType) {
    const data = AuthValidator.emailUserSchema.safeParse(body);
    return data;
  }

  /**
   * Validates login credentials.
   * @param body - The login credentials.
   * @returns The result of the validation.
   */
  public static validateLoginCredentials(body: LoginCredentialsType) {
    const data = AuthValidator.loginCredentialsSchema.safeParse(body);
    return data;
  }
}

export type GuestUserType = z.infer<typeof AuthValidator.guestUserSchema>;
export type EmailUserType = z.infer<typeof AuthValidator.emailUserSchema>;
export type LoginCredentialsType = z.infer<
  typeof AuthValidator.loginCredentialsSchema
>;
