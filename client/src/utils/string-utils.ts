/**
 * Utility class for string manipulation.
 */
export class StringUtils {
  /**
   * Removes new lines and trims the given string.
   * @param str - The string to remove new lines and trim.
   * @returns The string with new lines removed and trimmed.
   */
  public static removeNewLineAndTrim(str: string) {
    return str.replace(/\n/g, "").trim();
  }

  /**
   * Creates a username based on the given name and type.
   * @param name - The name to create the username from.
   * @param type - The type of the username ("guest" or "email").
   * @returns The created username.
   */
  public static createUsername(name: string, type: "guest" | "email") {
    if (type === "guest")
      return `guest_${name.toLowerCase().replace(/\s/g, "_")}`;
    return name.toLowerCase().replace(/\s/g, "_");
  }

  /**
   * Generates a username based on the given name by replacing spaces with underscores and converting to lowercase.
   * @param name - The name to generate the username from.
   * @param startsWith - Optional prefix for the username.
   * @returns The generated username.
   */
  public static makeUsername = (name: string, startsWith?: string) => {
    const sanitizedName = name
      ?.toLowerCase()
      .replace(/\s/g, "_")
      .replace(/\./g, "_");
    return `${startsWith ? startsWith + "_" : ""}${sanitizedName}`;
  };
}
