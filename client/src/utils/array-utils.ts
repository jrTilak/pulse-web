/**
 * Utility class for array operations.
 */
export class ArrayUtils {
  /**
   * Sorts an array of objects by the 'createdAt' property in descending order.
   * @param arr The array to be sorted.
   * @returns The sorted array.
   */
  public static sortByCreatedAt<T extends { createdAt: string | Date }>(
    arr: T[]
  ): T[] {
    return arr.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  /**
   * Sorts an array of objects by the 'sentAt' property in ascending order.
   * @param arr The array to be sorted.
   * @returns The sorted array.
   */
  public static sortBySentAt<T extends { sentAt: string | Date }>(
    arr: T[]
  ): T[] {
    return arr.sort((a, b) => {
      return new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime();
    });
  }
}
