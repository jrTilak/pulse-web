"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlyKeepTheseKeys = exports.filterKeysFromAnObject = exports.filterAKeyFromAnObject = void 0;
/**
 * Filters a key from an object and returns the remaining properties.
 * @param doc - The object to filter the key from.
 * @param key - The key to filter from the object.
 * @returns The object with the specified key filtered out.
 */
const filterAKeyFromAnObject = (doc, key) => {
    const { [key]: omit, ...rest } = doc._doc || doc.toObject();
    return rest;
};
exports.filterAKeyFromAnObject = filterAKeyFromAnObject;
/**
 * Filters out specified keys from an object.
 * @param doc - The object to filter keys from.
 * @param keys - An array of keys to be filtered out.
 * @returns The object with the specified keys filtered out.
 */
const filterKeysFromAnObject = (doc, keys) => {
    const obj = doc._doc || doc.toObject();
    const rest = {};
    for (const key in obj) {
        if (!keys.includes(key)) {
            rest[key] = obj[key];
        }
    }
    return rest;
};
exports.filterKeysFromAnObject = filterKeysFromAnObject;
/**
 * Filters an object and keeps only the specified keys.
 * @param doc - The object to filter.
 * @param keys - An array of keys to keep in the filtered object.
 * @returns The filtered object containing only the specified keys.
 */
const onlyKeepTheseKeys = (doc, keys) => {
    const obj = doc._doc || doc.toObject();
    const rest = {};
    for (const key in obj) {
        if (keys.includes(key)) {
            rest[key] = obj[key];
        }
    }
    return rest;
};
exports.onlyKeepTheseKeys = onlyKeepTheseKeys;
//# sourceMappingURL=obj-fns.js.map