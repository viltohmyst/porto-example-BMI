/**
 * A utility class to help perform validation on a server's inputs (incoming request)
 *
 * This class makes the validation of server inputs more scalable, avoiding nested "if"
 * statements in case we want to add more API endpoints and queries in the future.
 *
 * @file   This is the main entry file of the program
 * @author M. Hakim Adiprasetya
 */

import { URLSearchParams } from "url";

/**
 * The callback that allows the Rule class to search for a certain key in a collection
 */
export type AccessorCallback = (key?: string) => any; //value returns the value of a key. If key not found returns null

/**
 *The result of running the rule check on the URL
 *
 * @export
 * @interface RuleResult
 */
export interface RuleResult {
	passed: boolean;
	errorMessage?: string;
}

/*
 * This CheckCallback defines the callback signature which will be called by a "Rule" class
 */
type CheckCallback = (checkObject: AccessorCallback) => RuleResult;

/**
 * This "Rule" class implements the methods to check if a certain validation rule is fulfilled
 * Implements a quite common abstraction in the javascript world, which is method chaining
 *
 * @export
 * @class Rule
 */
export class Rule {
	private checkStruct: { [key: string]: CheckCallback } = {};

	/**
	 *Creates an instance of Rule.
	 * @constructor
	 * @param {string} type - The type of the "key's" value
	 * @param {string} key - The key of the item to validate
	 * @memberof Rule
	 */
	constructor(private type: string, private key: string) {}

	/**
	 * Check the equality of the value
	 *
	 * @param {any} value - the value to check equality for
	 * @memberof Rule
	 */
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

	/**
	 * Check whether the key's value is greater than a certain naumber
	 *
	 *  @param {number} value
	 * @memberof Rule
	 */
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

	/**
	 * Check whether the key's value is less than a number
	 *
	 * @param {number} value
	 * @memberof Rule
	 */
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

	/**
	 * Check whether the key's value is an integer
	 *
	 * @memberof Rule
	 */
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

	/**
	 * Check whether the key's value is a float
	 *
	 * @memberof Rule
	 */
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

	/**
	 * Validate that a key in a collection satisfies all rules set forth
	 *
	 * @param {AccessorCallback} checkObject - An object which returns a value (or null) given a key for a collection
	 * @memberof Rule
	 */
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

	/**
	 *
	 *
	 * @memberof Rule
	 */
	public resetRule = () => {
		this.checkStruct = {};
	};

	/**
	 *
	 *
	 * @readonly
	 * @memberof Rule
	 */
	public get length() {
		return Object.keys(this.checkStruct).length;
	}
}
