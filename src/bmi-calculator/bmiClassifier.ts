import { bmiWeightThreshold, bmiWeightType } from "./bmi.enum";

/**
 * The function which receives a bmi number and returns whether that number
 * describes a person as underweight, normal, or overweight
 *
 * @param {number} bmi - the value of the Body Mass Index
 * @returns {bmiWeightType} - returns an enum "string" describing whether normal, overweight, or underweight
 */
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
