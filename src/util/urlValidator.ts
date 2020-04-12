import { URL } from "url";
import { Rule, RuleResult, AccessorCallback } from "./validationRule";

/**
 * A class which is used to validate the query parameters of a URL
 *
 * @export
 * @class URLValidator
 */
export class URLValidator {
	private queryRuleArray: Rule[] = [];
	private numberOfQueryRequired: number = null;

	/**
	 * Checks to see if query parameter exists in a URL, returns a Rule
	 * object which can be used to further define the query requirements
	 *
	 * @param {string} name - the name of the query parameter
	 * @memberof URLValidator
	 */
	public shouldHaveQuery = (name: string): Rule => {
		const rule = new Rule("query", name);
		this.queryRuleArray.push(rule);
		return rule;
	};

	/**
	 * Checks to see if there are a certain amount of query parameters in a URL
	 *
	 * @param {number} amount - the required number of query parameters in a URL
	 * @memberof URLValidator
	 */
	public shouldHaveNumberofQuery = (amount: number) => {
		this.numberOfQueryRequired = amount;
	};

	/**
	 * Invoked to check whether the URL satisfies the requirements set according to
	 * certain rules previously defined using shouldHaveQuery and shouldHaveNumberofQuery
	 *
	 * @param {URL} urlToCheck - The URL to validate
	 * @memberof URLValidator
	 */
	public checkURLValidity = (urlToCheck: URL): RuleResult => {
		const returnResult: RuleResult = { passed: true, errorMessage: "" };

		//check each query's validity based on rule criteria

		// checkURLQuery is the concrete implementation of the "Accessor callback" interface to check for
		// query in a URL.
		const checkURLQuery: AccessorCallback = (query: string): any => {
			const result = urlToCheck.searchParams.get(query);
			return result;
		};

		this.queryRuleArray.forEach((value) => {
			const result = value.checkRule(checkURLQuery);
			if (result.passed === false) {
				returnResult.passed = false;
				returnResult.errorMessage += `${result.errorMessage}\r\n`;
			}
		});

		//check number of queries required
		if (this.numberOfQueryRequired !== null) {
			const params = urlToCheck.search.split("&");
			if (params.length !== this.numberOfQueryRequired) {
				returnResult.passed = false;
				returnResult.errorMessage += `There should be exactly ${this.numberOfQueryRequired} queries`;
			}
		}

		return returnResult;
	};
}
