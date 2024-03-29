// Generated by CodiumAI
import { isLeapYear } from "../src/worldtime-api/src/worldtime.ts";
describe("IsLeapYear", () => {
  // Returns true for a leap year divisible by 4
  it("should return true when the year is a leap year divisible by 4", () => {
    // Arrange
    const year = 2020;

    // Act
    const result = isLeapYear(year);

    // Assert
    expect(result).toBe(true);
  });

  // Returns true for year 0
  it("should return true when the year is 0", () => {
    // Arrange
    const year = 0;

    // Act
    const result = isLeapYear(year);

    // Assert
    expect(result).toBe(true);
  });
});
