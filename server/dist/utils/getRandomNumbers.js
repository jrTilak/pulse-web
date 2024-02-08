"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomNumber = void 0;
/**
 * Generates a random number between the specified range.
 * @param max - The maximum value of the range (inclusive).
 * @param min - The minimum value of the range (default: 0).
 * @returns A random number between the specified range.
 */
const getRandomNumber = (max, min = 0) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.getRandomNumber = getRandomNumber;
//# sourceMappingURL=getRandomNumbers.js.map