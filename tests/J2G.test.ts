
import {JNG} from '../src/worldtime-api/src/JNG.ts'
describe('julianToGregorain', () => {

    // Should correctly convert a Julian day number to a Gregorian date and time
    it('should correctly convert a positive Julian day number to a Gregorian date and time', () => {
      const jdn =2459376.5
      const result = JNG.julianToGregorain(jdn);
      expect(result).toEqual({ y: 2021, m: 6, d: 11, h: 0, n: 0, s: 0 });
    });
});
