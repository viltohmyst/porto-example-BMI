/**
 * Enum storing the types of weight classification based on BMI value
 */
export enum bmiWeightType {
	OVERWEIGHT = "overweight",
	NORMAL = "normal",
	UNDERWEIGHT = "underweight",
}

/**
 * Enum storing the threshold values used to classify the weight type
 * (i.e. whether someone is overweight, normal or underweight)
 * The values in the enum determine the "more than or equal to" values for threshold
 */
export enum bmiWeightThreshold {
	OVERWEIGHT_THRESHOLD = 25.0,
	NORMAL_THRESHOLD = 18.5,
}
