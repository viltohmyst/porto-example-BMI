import { URL } from "url";
import { Rule, RuleResult, AccessorCallback } from "./validationRule";

export class URLValidator {
	private queryRuleArray: Rule[] = [];
	private numberOfQueryRequired: number = null;

	public shouldHaveQuery = (name: string): Rule => {
		const rule = new Rule("query", name);
		this.queryRuleArray.push(rule);
		return rule;
	};

	public shouldHaveNumberofQuery = (amount: number) => {
		this.numberOfQueryRequired = amount;
	};

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
