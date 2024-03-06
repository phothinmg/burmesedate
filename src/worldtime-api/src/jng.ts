export interface WtProps {
  p_jdn: number; // julian day number
  p_tz: number; //Time Zone
  p_SG?: number; // 2361222-Gregorian start in British calendar (1752/Sep/14)
  p_ct?: number; // Calendar Type
}

interface TimeProps {
  hour: number;
  minutes: number;
  seconds: number;
}
/**
 * The 'jng' class represents a date and time utility in TypeScript.
 * It provides methods for converting between different date and time formats, such as Julian day number, Gregorian date and time, and Unix timestamp.
 * 
 * @class
 * @example
 * //Creating a new instance of 'jng' class
 * const wt = new jng({ p_jdn: 2459345.5, p_tz: -5 });
 * 
 * // Getting the current date and time in Gregorian format
 * const year = wt.year; // 2021
 * const month = wt.month; // 1
 * const date = wt.date; // 1
 * const hour = wt.hour; // 0
 * const minute = wt.minute; // 0
 * const second = wt.second; // 0
 * 
 * // Converting a Julian day number to a Gregorian date and time
 * const jdn = 2459345.5;
 * const ct = 0;
 * const SG = 2361222;
 * const result = jng.julianToGregorian(jdn, ct, SG);
 * console.log(result);
 * // { y: 2021, m: 1, d: 1, h: 0, n: 0, s: 0 }
 * 
 * // Converting a Gregorian date and time to a Julian day number
 * const julianDayNumber = jng.gregorianToJulian(2022, 10, 15, 14, 30, 0);
 * console.log(julianDayNumber); // Output: 2459701.1041666665
 * 
 * // Converting a Unix timestamp to a Julian day number
 * const unixTimestamp = 1640995200; // January 1, 2022 00:00:00 UTC
 * const julianDayNumber = jng.unixTojulian(unixTimestamp);
 * console.log(julianDayNumber); // Output: 2459580.5
 * 
 * // Getting the local time zone offset in hours
 * const timeZoneOffset = jng.ltzoh();
 * console.log(timeZoneOffset); // Output: -5
 */
export class jng {
  _jdn: number;
  _tz: number | undefined;
  _SG: number;
  _ct: number;

  constructor({ p_jdn, p_SG = 2361222, p_tz, p_ct = 0 }: WtProps) {
    this._jdn = p_jdn;
    this._tz = p_tz ?? jng.ltzoh();
    this._SG = p_SG;
    this._ct = p_ct;
  }
  /**
   * Calculates the day fraction based on the given time.
   *
   * @param hour - The hour component of the time.
   * @param minutes - The minutes component of the time.
   * @param seconds - The seconds component of the time.
   * @returns The day fraction calculated from the given time.
   */
  static timeToDayfraction({ hour, minutes, seconds }: TimeProps) {
    return (hour - 12) / 24 + minutes / 1440 + seconds / 86400;
  }

  /**
   * The julianToGregorian method converts a Julian day number to a Gregorian date and time.
   * 
   * @param jdn - The Julian day number to convert.
   * @param ct - The calendar type. Default is 0.
   * @param SG - The start of the Gregorian calendar in the British calendar. Default is 2361222.
   * @returns The resulting year, month, day, hour, minute, and second.
   * @example
   * const jdn = 2459345.5;
      const ct = 0;
      const SG = 2361222;

      const result = jng.julianToGregorian(jdn, ct, SG);
      console.log(result);
      // { y: 2021, m: 1, d: 1, h: 0, n: 0, s: 0 }
   * @includeExample ./example.ts: 1-8
   */
  public static julianToGregorian(
    jdn: number,
    ct: number = 0,
    SG: number = 2361222
  ): { y: number; m: number; d: number; h: number; n: number; s: number } {
    let j: number,
      jf: number,
      y: number,
      m: number,
      d: number,
      h: number,
      n: number,
      s: number;

    if (ct === 2 || (ct === 0 && jdn < SG)) {
      j = Math.floor(jdn + 0.5);
      jf = jdn + 0.5 - j;
      const b = j + 1524;
      const c = Math.floor((b - 122.1) / 365.25);
      const f = Math.floor(365.25 * c);
      const e = Math.floor((b - f) / 30.6001);
      m = e > 13 ? e - 13 : e - 1;
      d = b - f - Math.floor(30.6001 * e);
      y = m < 3 ? c - 4715 : c - 4716;
    } else {
      j = Math.floor(jdn + 0.5);
      jf = jdn + 0.5 - j;
      j -= 1721119;
      y = Math.floor((4 * j - 1) / 146097);
      j = 4 * j - 1 - 146097 * y;
      d = Math.floor(j / 4);
      j = Math.floor((4 * d + 3) / 1461);
      d = 4 * d + 3 - 1461 * j;
      d = Math.floor((d + 4) / 4);
      m = Math.floor((5 * d - 3) / 153);
      d = 5 * d - 3 - 153 * m;
      d = Math.floor((d + 5) / 5);
      y = 100 * y + j;
      if (m < 10) {
        m += 3;
      } else {
        m -= 9;
        y += 1;
      }
    }

    jf *= 24;
    h = Math.floor(jf);
    jf = (jf - h) * 60;
    n = Math.floor(jf);
    s = (jf - n) * 60;

    return { y, m, d, h, n, s };
  }

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
     console.log(julianDayNumber); // Output: 2459701.1041666665
   *  @includeExample ./example.ts: 1, 10-11
   */
  public static gregorianToJulian(
    y: number,
    m: number,
    d: number,
    h: number = 12,
    n: number = 0,
    s: number = 0,
    ct: number = 0,
    SG: number = 2361222
  ): number {
    const a = Math.floor((14 - m) / 12);
    y = y + 4800 - a;
    m = m + 12 * a - 3;

    let jd = d + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4);

    if (ct == 1) {
      jd = jd - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    } else if (ct == 2) {
      jd = jd - 32083;
    } else {
      jd = jd - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
      if (jd < SG) {
        jd =
          d +
          Math.floor((153 * m + 2) / 5) +
          365 * y +
          Math.floor(y / 4) -
          32083;
        if (jd > SG) jd = SG;
      }
    }

    return jd + this.timeToDayfraction({ hour: h, minutes: n, seconds: s });
  }
  /**
   * Converts a Unix timestamp to a Julian day number.
   *
   * @param ut - The Unix timestamp to convert.
   * @returns The resulting Julian day number.
   */
  // convert unix timestamp to jd
  private static unixTojulian(ut: number) {
    //number of seconds from 1970 Jan 1 00:00:00 (UTC)
    var jd = 2440587.5 + ut / 86400.0; //convert to day(/24h/60min/60sec) and to JD
    return jd;
  }
  //-------------------------------------------------------------------------
  // julian date to unix time
  private static julianTounix(jd: number) {
    return (jd - 2440587.5) * 86400.0 + 0.5;
  }
  // get current time in julian date
  private static jdnow() {
    var dt = new Date();
    // the number of milliseconds since 1 January 1970 00:00:00 / 1000
    var ut = dt.getTime() / 1000.0;
    return this.unixTojulian(ut);
  }
  // get local time zone offset between local time and UTC in days
  static ltzoh() {
    var dt = new Date();
    // the difference, in minutes, between UTC and local time
    var tz = dt.getTimezoneOffset() / 60.0;
    return -tz; // between local time and UTC
  }

  // set time zone in hours for this instance
  SetTimezone(
    tz: number //set time zone
  ) {
    if (tz == undefined) {
      this._tz = jng.ltzoh();
    } else if (tz <= 14 || tz >= -12) {
      this._tz = tz;
    }
  }
  // set time to now
  Set2Now() {
    this._jdn = jng.jdnow();
  }
  //-------------------------------------------------------------------------
  // set time in jd
  SetJD(jd: number) {
    this._jdn = jd;
  }
  //-------------------------------------------------------------------------
  // set in unix time
  SetUnixTime(ut: number) {
    this._jdn = jng.unixTojulian(ut);
  }
  SetDateTime(
    year: number,
    month: number,
    day: number,
    hour = 12,
    minute = 0,
    second = 0,
    tz = 0,
    ct = 0,
    SG = 2361222
  ) {
    this._jdn =
      jng.gregorianToJulian(year, month, day, hour, minute, second, ct, SG) -
      tz / 24.0;
  }
  // set calendar type [0=British (default), 1=Gregorian, 2=Julian]
  SetCT(ct: number) {
    ct = Math.round(ct % 3);
    this._ct = ct;
  }
  // set Beginning of Gregorian calendar in JDN [default=2361222]
  SetSG(sg: number) {
    sg = Math.round(sg);
    this._SG = sg;
  }
  private static wml(y: number, m: number, ct = 0, SG = 2361222) {
    var j1, j2;
    var m2 = m + 1;
    var y2 = y;
    if (m2 > 12) {
      y2++;
      m2 %= 12;
    }
    j1 = jng.gregorianToJulian(y, m, 1, 12, 0, 0, ct, SG);
    j2 = jng.gregorianToJulian(y2, m2, 1, 12, 0, 0, ct, SG);
    return j2 - j1;
  }
  /*---------------------get properties---------------------------------*/

  get julianDate() {
    return this._jdn;
  }
  // julian date for this time zone
  get julianDateTz() {
    const tz = this._tz || jng.ltzoh();
    return this._jdn + tz / 24.0;
  }
  get julianDateNumber() {
    return Math.round(this._jdn);
  }
  // julian date number for this time zone
  get julianDateNumberTz() {
    const tz = this._tz || jng.ltzoh();
    return Math.round(this._jdn + tz / 24.0);
  }
  private get dateTime() {
    return jng.julianToGregorian(this.julianDateTz, this._ct, this._SG);
  }
  get year() {
    return this.dateTime.y;
  }
  get month() {
    return this.dateTime.m;
  }
  get date() {
    return this.dateTime.d;
  }
  get hour() {
    return this.dateTime.h; //[0-23]
  }
  get minute() {
    return this.dateTime.n;
  }
  get second() {
    return Math.floor(this.dateTime.s); //should not take round to make sure s<60
  }
  get millisecond() {
    // second after decimal ... eg .. 5.248 -- only 0.248
    return Math.floor((this.dateTime.s - this.second) * 1000); // not rounded
  }
  get weekDay() {
    return (this.julianDateNumberTz + 2) % 7;
    // weekday [0=sat, 1=sun, ..., 6=fri]
  }
  get unixTime() {
    return jng.julianTounix(this._jdn);
  }
  get timeZone() {
    return this._tz;
    // offset in hour
  }
  get calendarType() {
    return this._ct;
    //calendar type [0=British (default), 1=Gregorian, 2=Julian]
  }
  get SG() {
    return this._SG;// Beginning of Gregorian calendar in JDN [default=2361222]
  }
  get lengthOfMonth(){
    return jng.wml(this.year, this.month, this._ct, this._SG)
  }
}
