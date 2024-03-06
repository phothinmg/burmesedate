import { jng, WtProps } from "../../worldtime-api/src/jng.ts";

class burmeseDate extends jng {
  constructor({ p_jdn, p_SG = 2361222, p_tz, p_ct = 0 }: WtProps) {
    super({ p_jdn, p_SG, p_tz, p_ct });
  }
  /**
   * Get Burmese year constants depending on era.
   *-------
   * @param my - my = Burmese year
   * @returns   EI = Myanmar calendar era id [1-3] : calculations methods/constants depends on era,
                WO = watat offset to compensate,
                NM = number of months to find excess days,
                EW = exception in watat year,
   */
  private static getMyConst = (my: number) => {
    let EI: number;
    let WO: number;
    let NM: number;
    let fme: [number, number][];
    let wte: number[] = [];
    let EW = 0;

    // The third era (the era after Independence 1312 ME and after)
    if (my >= 1312) {
      EI = 3;
      WO = -0.5;
      NM = 8;
      fme = [[1377, 1]];
      wte = [1344, 1345];
    }
    // The second era (the era under British colony: 1217 ME - 1311 ME)
    else if (my >= 1217) {
      EI = 2;
      WO = -1;
      NM = 4;
      fme = [
        [1234, 1],
        [1261, -1],
      ];
      wte = [1263, 1264];
    }
    // The first era (the era of Myanmar kings: ME1216 and before)
    // Thandeikta (ME 1100 - 1216)
    else if (my >= 1100) {
      EI = 1.3;
      WO = -0.85;
      NM = -1;
      fme = [
        [1120, 1],
        [1126, -1],
        [1150, 1],
        [1172, -1],
        [1207, 1],
      ];
      wte = [1201, 1202];
    }
    // Makaranta system 2 (ME 798 - 1099)
    else if (my >= 798) {
      EI = 1.2;
      WO = -1.1;
      NM = -1;
      fme = [
        [813, -1],
        [849, -1],
        [851, -1],
        [854, -1],
        [927, -1],
        [933, -1],
        [936, -1],
        [938, -1],
        [949, -1],
        [952, -1],
        [963, -1],
        [968, -1],
        [1039, -1],
      ];
    }
    // Makaranta system 1 (ME 0 - 797)
    else {
      EI = 1.1;
      WO = -1.1;
      NM = -1;
      fme = [
        [205, 1],
        [246, 1],
        [471, 1],
        [572, -1],
        [651, 1],
        [653, 2],
        [656, 1],
        [672, 1],
        [729, 1],
        [767, -1],
      ];
    }

    const i = this.d2ArraySearch(my, fme);
    if (i >= 0) {
      WO += fme[i][1];
    }

    if (this.d1ArraySearch(my, fme) >= 0) {
      EW = 1;
    }

    return { EI, WO, NM, EW };
  };
  /**
   * Performs a binary search on a two-dimensional array to find the index of the year.
   *
   * @param year - The year to search for.
   * @param array - The two-dimensional array to search in.
   * @returns The index of the year in the array, or -1 if not found.
   */
  private static d2ArraySearch(
    year: number,
    array: [number, number][]
  ): number {
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midYear = array[mid][0];

      if (midYear === year) {
        return mid;
      } else if (midYear < year) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return -1;
  }
  /**
   * Performs a binary search on a one-dimensional array to find the index of the year.
   *
   * @param year - The year to search for.
   * @param array - The one-dimensional array to search in.
   * @returns The index of the year in the array, or -1 if not found.
   */
  private static d1ArraySearch(
    year: number,
    array: [number, number][]
  ): number {
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midYear = array[mid][0];

      if (midYear === year) {
        return mid;
      } else if (midYear < year) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return -1;
  }
  /**
   *  Check WarHtut (intercalary month)
   * ---
   * @param my - (my = myanmar year).
   * @returns ( watat = intercalary month [1=watat, 0=common]
	            fm = full moon day of 2nd Waso in jdn_mm (jdn+6.5 for MMT) [only valid when watat=1])
   */
  public static checkWarHtutYear = (my: number) => {
    const SY = 365.2587565; // solar year
    const LM = 29.53058795; // lunar month
    const MO = 1954168.050623; // beginning of 0 ME for MMT
    const c = this.getMyConst(my); // get constants for the corresponding calendar era
    const TA = (SY / 12 - LM) * (12 - c.NM); // threshold to adjust
    let ed = (SY * (my + 3739)) % LM; // excess day
    if (ed < TA) ed += LM; // adjust excess days
    const fm = Math.round(SY * my + MO - ed + 4.5 * LM + c.WO); // full moon day of 2nd Waso
    let TW = 0;
    let watat = 0; // find watat
    if (c.EI >= 2) {
      // if 2nd era or later find watat based on excess days
      TW = LM - (SY / 12 - LM) * c.NM;
      if (ed >= TW) watat = 1;
    } else {
      // if 1st era, find watat by 19 years metonic cycle
      // Myanmar year is divided by 19 and there is intercalary month
      // if the remainder is 2,5,7,10,13,15,18
      watat = (my * 7 + 2) % 19;
      if (watat < 0) watat += 19;
      watat = Math.floor(watat / 12);
    }
    watat ^= c.EW; // correct watat exceptions
    return { fm, watat };
  };
  /**
   * Calculates the Myanmar year's related values based on the input Myanmar year.
   * @param my - The Myanmar year for which the calculations are performed.
   * @returns An object with properties myt, tg1, fm, and werr.
   */
  private static cal_my = (my: number) => {
    let yd = 0;
    let y1: any;
    let nd = 0;
    let werr = 0;
    let fm = 0;
    let y2 = this.checkWarHtutYear(my);
    let myt = y2.watat;

    do {
      yd++;
      y1 = this.checkWarHtutYear(my - yd);
    } while (y1.watat == 0 && yd < 3);

    if (myt) {
      nd = (y2.fm - y1.fm) % 354;
      myt = Math.floor(nd / 31) + 1;
      fm = y2.fm;

      if (nd != 30 && nd != 31) {
        werr = 1;
      }
    } else {
      fm = y1.fm + 354 * yd;
    }

    const tg1 = y1.fm + 354 * yd - 102;

    return { myt, tg1, fm, werr };
  };
  /**
   * Converts a Julian day number to a Myanmar (Burmese) calendar date.
   * @param jdNumber - The Julian day number to be converted.
   * @returns  
   *  burmeseYearType,
      burmeseYear,
      burmeseMonth,
      burmeseDate,
      lengthOfBurmeseMonth,
   */
  public static julianToBurmese = (jdNumber: number) => {
    const jdn = Math.round(jdNumber);
    const SY = 1577917828.0 / 4320000.0; // solar year (365.2587565)
    const MO = 1954168.050623; // beginning of 0 ME

    const my = Math.floor((jdn - 0.5 - MO) / SY); // Myanmar year
    const yo = this.cal_my(my); // check year

    let dd = jdn - yo.tg1 + 1; // day count
    const b = Math.floor(yo.myt / 2);
    const c = Math.floor(1 / (yo.myt + 1)); // big wa and common yr
    const myl = 354 + (1 - c) * 30 + b; // year length
    const mmt = Math.floor((dd - 1) / myl); // month type: late = 1 or early = 0

    // adjust day count and threshold
    dd -= mmt * myl;
    const a = Math.floor((dd + 423) / 512);
    let mm = Math.floor((dd - b * a + c * a * 30 + 29.26) / 29.544); // month
    const e = Math.floor((mm + 12) / 16);
    const f = Math.floor((mm + 11) / 16);
    const md = dd - Math.floor(29.544 * mm - 29.26) - b * e + c * f * 30; // day
    mm += f * 3 - e * 4 + 12 * mmt; // adjust month numbers for late months
    const mmlen = this.lengthOfBurmeseMonth(mm, yo.myt);
    const burmeseYearType = yo.myt;
    const burmeseYear = my;
    const burmeseMonth = mm;
    const burmeseDate = md;
    const lengthOfBurmeseMonth = mmlen;

    return {
      burmeseYearType,
      burmeseYear,
      burmeseMonth,
      burmeseDate,
      lengthOfBurmeseMonth,
    };
  };

  /**
   * Calculates the length of Burmese month from Burmese month and Burmese Year Type.
   * --------------------------------------------------------------------------
   * @param mm - Burmese month [Tagu=1, Kason=2, Nayon=3, 1st Waso=0, (2nd) Waso=4, Wagaung=5, 
                  Tawthalin=6, Thadingyut=7, Tazaungmon=8, Nadaw=9, Pyatho=10, Tabodwe=11,  
                  Tabaung=12, Late Tagu=13, Late Kason=14 ].
   * @param myt - Burmese year type [0=common, 1=little WarHtut, 2=big WarHtut])
   * @returns (mml = length of the Burmese month [29 or 30 days]).
   */
  public static lengthOfBurmeseMonth = (mm: number, myt: any): number => {
    let mml: number = 30 - (mm % 2); // Calculate the month length

    if (mm === 3) {
      mml += Math.floor(myt / 2); // Adjust if Nayon in big watat
    }

    return mml;
  };
  /**
   * Calculates moon phase from day of the Burmese month, Burmese month, and Burmese year type.
   * -----
   *
   * @param md - day of the month [1-30].
   * @param mm -  Burmese month [Tagu=1, Kason=2, Nayon=3, 1st Waso=0, (2nd) Waso=4, Wagaung=5, 
                  Tawthalin=6, Thadingyut=7, Tazaungmon=8, Nadaw=9, Pyatho=10, Tabodwe=11,  
                  Tabaung=12, Late Tagu=13, Late Kason=14 ].
   * @param myt - Burmese year type [0=common, 1=little WarHtut, 2=big WarHtut])
   * @returns (mp =moon phase [0=waxing, 1=full moon, 2=waning, 3=new moon])
   */
  public static calMoonPhase = (md: number, mm: number, myt: any): number => {
    // Calculate the month length based on the given month and year
    const mml = this.lengthOfBurmeseMonth(mm, myt);

    // Calculate the lunar month moon phase
    const lunarPhase =
      Math.floor((md + 1) / 16) + Math.floor(md / 16) + Math.floor(md / mml);

    return lunarPhase;
  };
  /**
   * Get fortnight day from month day
   * --
   * @param md ( md= day of the month [1-30])
   * @returns  (mf= fortnight day [1 to 15])
   */
  static calFortnightDay(md: number) {
    return md - 15 * Math.floor(md / 16);
  }
  /**
   * Get the apparent length of the year from year type.
   * ----
   *
   * @param myt ( myt = year type [0=common, 1=little watat, 2=big watat])
   * @returns ( myl= year length [354, 384, or 385 days])
   */
  static lengthOfBurmeseYear(myt: any) {
    return 354 + (1 - Math.floor(1 / (myt + 1))) * 30 + Math.floor(myt / 2);
  }
  /**
   * Get day of month from fortnight day, moon phase, and length of the month
   * ---
   * @param mf fortnight day [1 to 15] 
   * @param mp moon phase [0=waxing, 1=full moon, 2=waning, 3=new moon]
   * @param mm month [Tagu=1, Kason=2, Nayon=3, 1st Waso=0, (2nd) Waso=4, Wagaung=5, 
                Tawthalin=6, Thadingyut=7, Tazaungmon=8, Nadaw=9, Pyatho=10, Tabodwe=11,  
                Tabaung=12, Late Tagu=13, Late Kason=14 ]
   * @param myt year type [0=common, 1=little watat, 2=big watat])
  *  @returns ( md = day of the month [1-30])
   */
  static calDayOfMonth(
    mf: number,
    mp: number,
    mm: number,
    myt: number
  ): number {
    var mml = this.lengthOfBurmeseMonth(mm, myt);
    var m1 = mp % 2;
    var m2 = Math.floor(mp / 2);
    return m1 * (15 + m2 * (mml - 15)) + (1 - m1) * (mf + 15 * m2);
  }

  /**
   * Burmese date to Julian day number
   * -----
   * @param my year
   * @param mm month [Tagu=1, Kason=2, Nayon=3, 1st Waso=0, (2nd) Waso=4, Wagaung=5, 
               Tawthalin=6, Thadingyut=7, Tazaungmon=8, Nadaw=9, Pyatho=10, Tabodwe=11,  
               Tabaung=12 , Late Tagu=13, Late Kason=14 ],
   * @param md day of the month [1-30]
   * @returns  (jd -julian day number)
   */

  static burmeseToJulian(my: number, mm: number, md: number): number {
    var b, c, dd, myl, mmt;
    var yo = this.cal_my(my); //check year
    mmt = Math.floor(mm / 13);
    mm = (mm % 13) + mmt; // to 1-12 with month type
    b = Math.floor(yo.myt / 2);
    c = 1 - Math.floor((yo.myt + 1) / 2); //if big watat and common year
    mm += 4 - Math.floor((mm + 15) / 16) * 4 + Math.floor((mm + 12) / 16); //adjust month
    dd =
      md +
      Math.floor(29.544 * mm - 29.26) -
      c * Math.floor((mm + 11) / 16) * 30 +
      b * Math.floor((mm + 12) / 16);
    myl = 354 + (1 - c) * 30 + b;
    dd += mmt * myl; //adjust day count with year length
    return dd + yo.tg1 - 1;
  }

  /**
   * Set Myanmar date time for a timezone and a calendar type
   * ----
   * timezone and calendar type won't be affected (tz and ct remain unchanged)
   * 
   * @param my year
   * @param mm month [Tagu=1, Kason=2, Nayon=3, 1st Waso=0, (2nd) Waso=4, Wagaung=5, 
               Tawthalin=6, Thadingyut=7, Tazaungmon=8, Nadaw=9, Pyatho=10, Tabodwe=11,  
               Tabaung=12 , Late Tagu=13, Late Kason=14 ]
   * @param md day of the month [1-30]
   * @param hour 
   * @param minute 
   * @param second 
   * @param tz 
   */
  SetMDateTime(
    my: number,
    mm: number,
    md: number,
    hour = 12,
    minute = 0,
    second = 0,
    tz = 0
  ): void {
    this._jdn =
      burmeseDate.burmeseToJulian(my, mm, md) +
      burmeseDate.timeToDayfraction({
        hour: hour,
        minutes: minute,
        seconds: second,
      }) -
      tz / 24.0;
  }

  /* Checking Burmese Astrological days
   More details @ http://cool-emerald.blogspot.sg/2013/12/myanmar-astrological-calendar-days.html
  */
  /**
   * Get sabbath day and sabbath eve from day of the month, month, and year type.
   * ----
   * @param md day of the month [1-30]
   * @param mm month [Tagu=1, Kason=2, Nayon=3, 1st Waso=0, (2nd) Waso=4, Wagaung=5, 
                Tawthalin=6, Thadingyut=7, Tazaungmon=8, Nadaw=9, Pyatho=10, Tabodwe=11,  
                Tabaung=12, Late Tagu=13, Late Kason=14 ]
   * @param myt  year type [0=common, 1=little watat, 2=big watat])
   * @returns ( [1=sabbath, 2=sabbath eve, 0=else])
   */
  static calSabbath(md: number, mm: number, myt: number) {
    var mml = burmeseDate.lengthOfBurmeseMonth(mm, myt);
    var s = 0;
    if (md == 8 || md == 15 || md == 23 || md == mml) s = 1;
    if (md == 7 || md == 14 || md == 22 || md == mml - 1) s = 2;
    return s;
  }

  /**
   * Get yatyaza from month, and weekday
   * ---
    
    @param mm = month [Tagu=1, Kason=2, Nayon=3, 1st Waso=0, (2nd) Waso=4, Wagaung=5, 
            Tawthalin=6, Thadingyut=7, Tazaungmon=8, Nadaw=9, Pyatho=10, Tabodwe=11,  
            Tabaung=12, Late Tagu=13, Late Kason=14 ], 
    @param  wd= weekday  [0=sat, 1=sun, ..., 6=fri])
    @returns ( [1=yatyaza, 0=else])
  */
  static calYatyaza(mm: number, wd: number) {
    //first waso is considered waso
    var m1 = mm % 4;
    var yatyaza = 0;
    var wd1 = Math.floor(m1 / 2) + 4;
    var wd2 = (1 - Math.floor(m1 / 2) + (m1 % 2)) * (1 + 2 * (m1 % 2));
    if (wd == wd1 || wd == wd2) yatyaza = 1;
    return yatyaza;
  }
  /**
   * Get pyathada from month, and weekday
   * ---
   * @param mm month [Tagu=1, Kason=2, Nayon=3, 1st Waso=0, (2nd) Waso=4, Wagaung=5, 
                Tawthalin=6, Thadingyut=7, Tazaungmon=8, Nadaw=9, Pyatho=10, Tabodwe=11,  
                Tabaung=12, Late Tagu=13, Late Kason=14 ]
   * @param wd weekday  [0=sat, 1=sun, ..., 6=fri])
   * @returns  ( [1=pyathada, 2=afternoon pyathada, 0=else])
   */
  static calPyathada(mm: number, wd: number) {
    //first waso is considered waso
    var m1 = mm % 4;
    var pyathada = 0;
    var wda = [1, 3, 3, 0, 2, 1, 2];
    if (m1 == 0 && wd == 4) pyathada = 2; //afternoon pyathada
    if (m1 == wda[wd]) pyathada = 1;
    return pyathada;
  }

  /** 
   * Nagahle 
   * ----

	@param mm = month [Tagu=1, Kason=2, Nayon=3, 1st Waso=0, (2nd) Waso=4, Wagaung=5, 
	        Tawthalin=6, Thadingyut=7, Tazaungmon=8, Nadaw=9, Pyatho=10, Tabodwe=11,  
	       Tabaung=12, Late Tagu=13, Late Kason=14 ])
	@returns ( [0=west, 1=north, 2=east, 3=south])
  */
  static calNagahle(mm: number) {
    if (mm <= 0) mm = 4; //first waso is considered waso
    return Math.floor((mm % 12) / 3);
  }

  /** 
   * mahabote 
   * ---
	@param my = year
	@param wd= weekday  [0=sat, 1=sun, ..., 6=fri])
  @returns ( [0=Binga, 1=Atun, 2=Yaza, 3=Adipati, 4= Marana, 5=Thike, 6=Puti])
  */
  static calMahabote(my: number, wd: number): number {
    return (my - wd) % 7;
  }
}
