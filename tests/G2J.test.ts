import {JNG} from '../src/worldtime-api/src/JNG.ts'
describe('gregorainToJulian', () => {

    // Should return the correct Julian day number for a given Gregorian date and time
    it('should return the correct Julian day number for a given Gregorian date and time', () => {
      const result = JNG.gregorainToJulian(2022, 10, 31);
      expect(result).toBe(2459884);
    });

    // Should return the correct Julian day number for the earliest possible Gregorian date and time
    it('should return the correct Julian day number for the earliest possible Gregorian date and time', () => {
      const result = JNG.gregorainToJulian(1752, 9, 14);
      expect(result).toBe(2361222);
    });
});
