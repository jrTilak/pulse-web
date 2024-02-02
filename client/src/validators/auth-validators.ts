import { z } from "zod";

/**
 * A class that provides validation schemas and methods for authentication related data.
 */
export class AuthValidator {
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
}

export type EmailUserType = z.infer<typeof AuthValidator.emailUserSchema>;
export type LoginCredentialsType = z.infer<
  typeof AuthValidator.loginCredentialsSchema
>;
