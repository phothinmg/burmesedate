import { data } from "../lib/tzone.ts";
import { jng } from "./jng.ts";

/**
   * The julianToGregorian method converts a Julian day number to a Gregorian date and time.
   * 
   * @param jdn - The Julian day number to convert.
   * @param ct - The calendar type. Default is 0.[0=British (default), 1=Gregorian, 2=Julian].
   * @param SG - The start of the Gregorian calendar in the British calendar. Default is 2361222.
   * @returns The resulting year, month, day, hour, minute, and second.
   * @example
   * const jdn = 2459345.5;
      const ct = 0;
      const SG = 2361222;

      const result = jng.julianToGregorian(jdn, ct, SG);
      console.log(result);
      // { y: 2021, m: 1, d: 1, h: 0, n: 0, s: 0 }
*/
export const julianToGregorian = jng.julianToGregorian;

/**
   * Converts a Gregorian date and time to a Julian day number.
   * 
   * @param y - The year component of the Gregorian date.
   * @param m - The month component of the Gregorian date.
   * @param d - The day component of the Gregorian date.
   * @param h - The hour component of the time. Default is 12.
   * @param n - The minutes component of the time. Default is 0.
   * @param s - The seconds component of the time. Default is 0.
   * @param ct - The calendar type. Default is 0.
   * @param SG - The start of the Gregorian calendar in the British calendar. Default is 2361222.
   * @returns The resulting Julian day number.
   * @example 
   * const julianDayNumber = jng.gregorianToJulian(2022, 10, 15, 14, 30, 0);
     console.log(julianDayNumber); 
*/

export const gregorianToJulian = jng.gregorianToJulian;

/**
  * Calculates the day of the year for a given date.
  * 
  * Flow
  * 
  * Create a new Date object named startOfYear with the same year as the input date and the month and day set to 0.
    Calculate the time difference between the input date and startOfYear using the getTime() method.
    Convert the time difference to days by dividing it by the number of milliseconds in a day.
    Round down the result using the Math.floor() function.
    Return the number of days as the output.
  * @param date - The input date for which the day of the year needs to be calculated.
  * @returns The day of the year for the given input date.
  * @example
       const date = new Date(2022, 6, 15);
       const day = dayOfYear(date);
       console.log(day); // Output: 196
*/
export const dayOfYear = (date: Date): number => {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const timeDiff = date.getTime() - startOfYear.getTime();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return days;
};
/**
 * Determines whether a given year is a leap year or not.
 * 
 * Flow
 * 
    Check if the given year is divisible by 4. If it is not, return false.
    If the year is divisible by 4, check if it is not divisible by 100. If it is not divisible by 100, return true.
    If the year is divisible by both 4 and 100, check if it is not divisible by 400. If it is not divisible by 400, return false.
    If the year is divisible by both 4, 100, and 400, return true.
 * @param year - The year to be checked for leap year.
 * @returns true if the year is a leap year, false otherwise.
 * @example
 * const year = 2020;
   const IsLeapYear = isLeapYear(year);
   console.log(IsLeapYear); // Output: true
 */
export function isLeapYear(year: number): boolean {
  if (year % 4 !== 0) {
    return false;
  } else if (year % 100 !== 0) {
    return true;
  } else if (year % 400 !== 0) {
    return false;
  } else {
    return true;
  }
}
/**
 * Calculates the number of days between a given date and a fixed reference date (1752-01-01).
 * @param year - The year of the date.
 * @param month - The month of the date.
 * @param date - The day of the month.
 * @returns The number of days between the given date and the reference date.
 */
export const GetDay = (year: number, month: number, date: number): number => {
  const referenceDate = new Date(1752, 0, 1);
  const givenDate = new Date(year, month - 1, date);
  const daysDifference = Math.floor(
    (givenDate.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysDifference;
};
/**
 * Calculates the number of days between two dates.
 *
 * @param dateFrom - The starting date in the format 'YYYY-MM-DD'.
 * @param dateTo - The ending date in the format 'YYYY-MM-DD'.
 * @returns The number of days between the two dates.
 */
export function DaysBetweenDates(dateFrom: string, dateTo: string) {
  const [y1, m1, d1] = dateFrom.split("-").map(Number);
  const [y2, m2, d2] = dateTo.split("-").map(Number);

  const daysA = GetDay(y1, m1, d1);
  const daysB = GetDay(y2, m2, d2);

  const daysBetween = daysB - daysA;

  return daysBetween;
}
/**
 * Retrieves information about a specific time zone.
 * 
 * Flow
 * 
  Split the timeZoneName to get the continent.
  Find the time zone data that matches the timeZoneName and belongs to the same group.
  Calculate the raw offset in minutes and convert it to seconds.
  Get the current timestamp in UTC and calculate the local timestamp by subtracting the raw offset.
  Create a Date object using the local timestamp.
  Calculate the day number of the year and the week number of the year.
  Extract the UTC offset string from the raw format.
  Format the local date and time string by combining the UTC string with the alternative name.
  Format the UTC date and time string using the current timestamp in UTC.
  Filter the time zone data to get the time zones in the same continent.
  Return an object containing all the retrieved information.
 *
 * @param timeZoneName - The name of the time zone.
 * @returns An object containing various information about the time zone, including the raw offset in minutes, raw offset in seconds,
 * current timestamp in UTC, current timestamp in the local time zone, local date and time, day number of the year,
 * week number of the year, UTC offset string, local date and time string, UTC date and time string,
 * and a list of time zones in the same continent.
 * @example
 * const timeZoneInfo = WorldTime("Pacific/Niue");
   console.log(timeZoneInfo);
 */
export function WorldTime(timeZoneName: string): {
  rawOffsetInMinutes: number;
  rawOffsetInSeconds: number;
  timestampInUtc: number;
  timestampLocal: number;
  localDateTime: Date;
  dayNumberOfYear: number;
  weekOfYear: number;
  utcOffsetString: string;
  localDateTimeString: string;
  utcDateTimeString: string;
  timeZonesByContinent: string[];
} {
  const continent = timeZoneName.split("/")[0];
  const dataToFind = data.find(
    (item) => item.group.includes(timeZoneName) && item.name === timeZoneName
  );

  if (dataToFind === undefined) {
    console.log("Time Zone is not valid");
    return {
      rawOffsetInMinutes: 0,
      rawOffsetInSeconds: 0,
      timestampInUtc: 0,
      timestampLocal: 0,
      localDateTime: new Date(),
      dayNumberOfYear: 0,
      weekOfYear: 0,
      utcOffsetString: "",
      localDateTimeString: "",
      utcDateTimeString: "",
      timeZonesByContinent: [],
    };
  }

  const rawOffsetInMinutes = dataToFind.rawOffsetInMinutes;
  const rawOffsetInSeconds = -rawOffsetInMinutes * 60 * 1000;
  const timestampInUtc = Date.now();
  const timestampLocal = timestampInUtc - rawOffsetInMinutes * 60 * 1000;
  const localDateTime = new Date(timestampLocal);
  const dayNumberOfYear = dayOfYear(localDateTime);
  const weekOfYear = Math.round(dayNumberOfYear / 7);
  const utcOffsetString = dataToFind.rawFormat.split(" ")[0];
  const localDateTimeString =
    localDateTime.toUTCString().split(" ").slice(0, -1).join(" ") +
    " " +
    dataToFind.alternativeName;
  const utcDateTimeString = new Date(timestampInUtc).toUTCString();
  const timeZonesByContinent = data
    .filter((obj) => obj.name.split("/")[0] === continent)
    .map((obj) => obj.name);

  return {
    rawOffsetInMinutes,
    rawOffsetInSeconds,
    timestampInUtc,
    timestampLocal,
    localDateTime,
    dayNumberOfYear,
    weekOfYear,
    utcOffsetString,
    localDateTimeString,
    utcDateTimeString,
    timeZonesByContinent,
  };
}
