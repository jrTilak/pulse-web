/**
 * Generates a random number between the specified range.
 * @param max - The maximum value of the range (inclusive).
 * @param min - The minimum value of the range (default: 0).
 * @returns A random number between the specified range.
 */
export const getRandomNumber = (max: number, min: number = 0) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
