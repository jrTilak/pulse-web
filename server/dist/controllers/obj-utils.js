"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveOnlyTheseKeys = void 0;
/**
 * Creates a new object with only the specified keys from the original object.
 * @param obj - The original object.
 * @param keys - An array of keys to include in the new object.
 * @returns A new object containing only the specified keys from the original object.
 */
const saveOnlyTheseKeys = (obj, keys) => {
    const newObj = {};
    for (const key of keys) {
        newObj[key] = obj[key];
    }
    return newObj;
};
exports.saveOnlyTheseKeys = saveOnlyTheseKeys;
//# sourceMappingURL=obj-utils.js.map