/**
 * Filters a key from an object and returns the remaining properties.
 * @param doc - The object to filter the key from.
 * @param key - The key to filter from the object.
 * @returns The object with the specified key filtered out.
 */
export const filterAKeyFromAnObject = (doc: any, key: string) => {
  const { [key]: omit, ...rest } = doc._doc || doc.toObject();
  return rest;
};

/**
 * Filters out specified keys from an object.
 * @param doc - The object to filter keys from.
 * @param keys - An array of keys to be filtered out.
 * @returns The object with the specified keys filtered out.
 */
export const filterKeysFromAnObject = (doc: any, keys: string[]) => {
  const obj = doc._doc || doc.toObject();
  const rest = {};
  for (const key in obj) {
    if (!keys.includes(key)) {
      rest[key] = obj[key];
    }
  }
  return rest;
};

/**
 * Filters an object and keeps only the specified keys.
 * @param doc - The object to filter.
 * @param keys - An array of keys to keep in the filtered object.
 * @returns The filtered object containing only the specified keys.
 */
export const onlyKeepTheseKeys = (doc: any, keys: string[]) => {
  const obj = doc._doc || doc.toObject();
  const rest = {};
  for (const key in obj) {
    if (keys.includes(key)) {
      rest[key] = obj[key];
    }
  }
  return rest;
};
