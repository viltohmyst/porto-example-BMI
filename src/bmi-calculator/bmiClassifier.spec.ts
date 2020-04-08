import { bmiClassifier } from "./bmiClassifier";
import { bmiWeightType, bmiWeightThreshold } from "./bmi.enum";

describe("BMI Classifier", () => {
  describe("bmiClassifier", () => {
    it("should return null when bmi is less than equal to 0", () => {
      expect(bmiClassifier(0)).toEqual(null);
      expect(bmiClassifier(-1)).toEqual(null);
    });

    it("should return null when bmi is null or undefined", () => {
      expect(bmiClassifier(null)).toEqual(null);
      expect(bmiClassifier(undefined)).toEqual(null);
    });

    it("should return underweight properly", () => {
      expect(bmiClassifier(1)).toEqual(bmiWeightType.UNDERWEIGHT);
      expect(bmiClassifier(bmiWeightThreshold.NORMAL_THRESHOLD - 0.1)).toEqual(
        bmiWeightType.UNDERWEIGHT
      );
    });

    it("should return normal weight properly", () => {
      expect(bmiClassifier(bmiWeightThreshold.NORMAL_THRESHOLD)).toEqual(
        bmiWeightType.NORMAL
      );
      expect(
        bmiClassifier(bmiWeightThreshold.OVERWEIGHT_THRESHOLD - 0.1)
      ).toEqual(bmiWeightType.NORMAL);
    });

    it("should return overweight properly", () => {
      expect(bmiClassifier(bmiWeightThreshold.OVERWEIGHT_THRESHOLD)).toEqual(
        bmiWeightType.OVERWEIGHT
      );
      expect(
        bmiClassifier(bmiWeightThreshold.OVERWEIGHT_THRESHOLD + 0.1)
      ).toEqual(bmiWeightType.OVERWEIGHT);
    });
  });
});
