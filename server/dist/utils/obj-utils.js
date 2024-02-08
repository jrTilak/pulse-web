"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObjUtils {
    /**
     * Creates a new object with only the specified keys from the original object.
     * @param obj - The original object.
     * @param keys - An array of keys to include in the new object.
     * @returns A new object containing only the specified keys from the original object.
     */
    static saveOnlyTheseKeys = (obj, keys) => {
        const newObj = {};
        for (const key of keys) {
            newObj[key] = obj[key];
        }
        return newObj;
    };
}
exports.default = ObjUtils;
//# sourceMappingURL=obj-utils.js.map