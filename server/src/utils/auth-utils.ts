export default class AuthUtils {
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
  }