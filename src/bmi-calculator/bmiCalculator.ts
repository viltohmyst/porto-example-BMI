/*
 *Calculates the Body Mass Index with the following formula : BMI = weight(kg) / height^2(m^2)
 *@params weight in kg
 *@params height in cm
 *
 */
export const bmiCalculator = (height: number, weight: number): number => {
  //basic error checking (inputs cannot be null, undefined, NAN, less than zero)
  if (!!height === false || !!weight === false || height < 0 || weight < 0) {
    return null;
  }

  //convert height in cm to height^2 in m^2
  const heightSquared = Math.pow(height / 100, 2);
  const bmi = weight / heightSquared;
  return bmi;
};
