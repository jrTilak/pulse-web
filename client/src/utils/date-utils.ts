/**
 * Utility class for date-related operations.
 */
export default class DateUtils {
  /**
   * Calculates the time elapsed between a given start date and the current date.
   * @param startDate - The start date in string format.
   * @returns A string representation of the time elapsed, in the format "x yr", "x day", "x hr", "x min", or "x s".
   */
  public static getTimeElapsed = (startDate: string): string => {
    const currentDate = new Date();
    const startDateFormatted = new Date(startDate);
    const timeElapsed = currentDate.getTime() - startDateFormatted.getTime();

    const seconds = Math.floor(timeElapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (years > 0) {
      return `${years} yr`;
    } else if (days > 0) {
      return `${days} day`;
    } else if (hours > 0) {
      return `${hours} hr`;
    } else if (minutes > 0) {
      return `${minutes} min`;
    } else {
      return `${seconds} s`;
    }
  };
}
