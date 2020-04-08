import { bmiCalculator } from "./bmiCalculator";

describe("BMI Calculator", () => {
  describe("bmiCalculator", () => {
    it("should return null when height or weight is less than equal to 0", () => {
      expect(bmiCalculator(-1, 10)).toEqual(null);
      expect(bmiCalculator(10, -1)).toEqual(null);
      expect(bmiCalculator(-1, -1)).toEqual(null);
      expect(bmiCalculator(0, 0)).toEqual(null);
    });

    it("should return null when inputs are null or undefined", () => {
      expect(bmiCalculator(null, null)).toEqual(null);
      expect(bmiCalculator(10, null)).toEqual(null);
      expect(bmiCalculator(null, 10)).toEqual(null);
      expect(bmiCalculator(undefined, undefined)).toEqual(null);
      expect(bmiCalculator(10, undefined)).toEqual(null);
      expect(bmiCalculator(undefined, 10)).toEqual(null);
    });

    it("should return a number when successful", () => {
      expect(bmiCalculator(170, 70)).toBeCloseTo(24.22);
      expect(bmiCalculator(200, 200)).toBeCloseTo(50);
      //doesn't check about invalid (extreme results) here,
      //can check for these types of errors in other code
      expect(bmiCalculator(20, 10)).toBeCloseTo(249.999);
    });
  });
});
