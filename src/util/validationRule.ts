import { URLSearchParams } from "url";
/*
 * Utility class to help perform validation on server's inputs (incoming request)
 * I made this into a class to show some OOP parts in this demo app.
 * This class makes the validation of server inputs more scalable, avoiding nested "if"
 * statements in case we want to add more API endpoints and queries in the future.
 */

// ...
export type AccessorCallback = (key?: string) => any; //value returns the value of a key. If key not found returns null

// The result of running the rule check on the URL
export interface RuleResult {
	passed: boolean;
	errorMessage?: string;
}

/*
 * This CheckCallback defines the callback signature which will be called by a "Rule" class
 */
type CheckCallback = (checkObject: AccessorCallback) => RuleResult;

/*
 * This "Rule" class implements the methods to check if a certain validation rule is fulfilled
 * Implements a quite common abstraction in the javascript world, which is method chaining
 */
export class Rule {
	private checkStruct: { [key: string]: CheckCallback } = {};

	constructor(private type: string, private key: string) {}

	public equal = (value: any) => {
		this.checkStruct["equal"] = (checkObject) => {
			const tempValue = checkObject(this.key);
			if (tempValue !== null && tempValue == value) {
				return { passed: true };
			} else {
				return {
					passed: false,
					errorMessage: `Value of ${this.type} ${this.key} is not equal to ${value}`,
				};
			}
		};
		return this;
	};

	public greaterThan = (value: number) => {
		this.checkStruct["greaterThan"] = (checkObject) => {
			const tempValue = checkObject(this.key);
			if (tempValue !== null && parseFloat(tempValue) > value) {
				return { passed: true };
			} else {
				return {
					passed: false,
					errorMessage: `Value of ${this.type} ${this.key} is not greater than ${value}`,
				};
			}
		};
		return this;
	};

	public lessThan = (value: number) => {
		this.checkStruct["lessThan"] = (checkObject) => {
			const tempValue = checkObject(this.key);
			if (tempValue !== null && parseFloat(tempValue) < value) {
				return { passed: true };
			} else {
				return {
					passed: false,
					errorMessage: `Value of ${this.type} ${this.key} is not less than ${value}`,
				};
			}
		};
		return this;
	};

	public isInteger = () => {
		this.checkStruct["isInteger"] = (checkObject) => {
			const tempValue = checkObject(this.key);
			if (tempValue !== null && parseInt(tempValue) == tempValue) {
				return { passed: true };
			} else {
				return {
					passed: false,
					errorMessage: `Value of ${this.type} ${this.key} is not an integer`,
				};
			}
		};
		return this;
	};

	public isFloat = () => {
		this.checkStruct["isFloat"] = (checkObject) => {
			const tempValue = checkObject(this.key);
			if (tempValue !== null && parseFloat(tempValue) == tempValue) {
				return { passed: true };
			} else {
				return {
					passed: false,
					errorMessage: `Value of ${this.type} ${this.key} is not a float`,
				};
			}
		};
		return this;
	};
	public checkRule = (checkObject: AccessorCallback): RuleResult => {
		// check to see if value exists
		if (checkObject(this.key) === null) {
			return {
				passed: false,
				errorMessage: `${this.type} of ${this.key} was not found`,
			};
		}

		//iterate over all items in the check array
		const returnResult = { passed: true, errorMessage: "" };
		for (const key in this.checkStruct) {
			const result = this.checkStruct[key](checkObject);
			if (result.passed === false) {
				returnResult.passed = false;
				returnResult.errorMessage += `${result.errorMessage}. \r\n`;
			}
		}

		return returnResult;
	};

	public resetRule = () => {
		this.checkStruct = {};
	};

	public get length() {
		return Object.keys(this.checkStruct).length;
	}
}
