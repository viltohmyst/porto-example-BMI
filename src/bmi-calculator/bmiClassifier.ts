import { bmiWeightThreshold, bmiWeightType } from "./bmi.enum";

export const bmiClassifier = (bmi: number): bmiWeightType => {
  //basic error checking (inputs cannot be null, undefined, NAN, less than zero)
  if (!!bmi === false || bmi < 0) {
    return null;
  }

  if (bmi >= bmiWeightThreshold.OVERWEIGHT_THRESHOLD) {
    return bmiWeightType.OVERWEIGHT;
  } else if (bmi >= bmiWeightThreshold.NORMAL_THRESHOLD) {
    return bmiWeightType.NORMAL;
  } else {
    return bmiWeightType.UNDERWEIGHT;
  }
};
