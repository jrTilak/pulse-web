"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthUtils {
    /**
     * Creates a username based on the given name and type.
     * @param name - The name to create the username from.
     * @param type - The type of the username ("guest" or "email").
     * @returns The created username.
     */
    static createUsername(name, type) {
        if (type === "guest")
            return `guest_${name.toLowerCase().replace(/\s/g, "_")}`;
        return name.toLowerCase().replace(/\s/g, "_");
    }
}
exports.default = AuthUtils;
//# sourceMappingURL=auth-utils.js.map