import { Rule, RuleResult, AccessorCallback } from "./validationRule";

describe("Rule", () => {
	describe("method chaining", () => {
		const complexRuleInteger = new Rule("query", "foo");
		const complexRuleFloat = new Rule("query", "bar");
		beforeAll(() => {
			complexRuleInteger.isInteger().greaterThan(5).lessThan(10).equal(7);
			complexRuleFloat
				.isFloat()
				.greaterThan(5.5)
				.lessThan(10.5)
				.equal(7.5);
		});
		it("should return false if one or more conditions are false", () => {
			expect(complexRuleInteger.checkRule(() => 4)).toMatchObject({
				passed: false,
			});
			expect(complexRuleInteger.checkRule(() => 11)).toMatchObject({
				passed: false,
			});
			expect(complexRuleInteger.checkRule(() => 6)).toMatchObject({
				passed: false,
			});
			expect(complexRuleInteger.checkRule(() => "oranges")).toMatchObject(
				{
					passed: false,
				}
			);
			expect(complexRuleFloat.checkRule(() => 4.5)).toMatchObject({
				passed: false,
			});
			expect(complexRuleFloat.checkRule(() => 11.5)).toMatchObject({
				passed: false,
			});
			expect(complexRuleFloat.checkRule(() => 6.5)).toMatchObject({
				passed: false,
			});
			expect(complexRuleFloat.checkRule(() => "oranges")).toMatchObject({
				passed: false,
			});
		});

		it("should return pass if all conditions are met", () => {
			expect(complexRuleInteger.checkRule(() => 7)).toMatchObject({
				passed: true,
			});
			expect(complexRuleFloat.checkRule(() => 7.5)).toMatchObject({
				passed: true,
			});
		});
	});

	describe("null error checking", () => {
		const rule = new Rule("objectType", "noExist");
		it("should return false if value is null", () => {
			expect(rule.checkRule(() => null)).toEqual({
				passed: false,
				errorMessage: "objectType of noExist was not found",
			});
		});

		it("should not continue checking for other rules if value is null", () => {
			rule.equal("15");
			rule.lessThan(20);
			expect(rule.checkRule(() => null)).toEqual({
				passed: false,
				errorMessage: "objectType of noExist was not found",
			});
		});
	});

	describe("reset and length", () => {
		const rule = new Rule("objectType", "keyName");
		it("should have length of zero if no rules have been added", () => {
			expect(rule.length).toEqual(0);
		});
		it("adding the same rule should not add the rule length (just replaces old rule)", () => {
			rule.equal(5);
			rule.greaterThan(4);
			expect(rule.length).toEqual(2);
			rule.equal(6);
			expect(rule.length).toEqual(2);
			expect(rule.checkRule(() => 6)).toEqual({
				passed: true,
				errorMessage: "",
			});
		});
		it("calling reset deletes all rules", () => {
			rule.resetRule();
			expect(rule.length).toEqual(0);
		});
	});

	describe("equal", () => {
		const ruleInteger = new Rule("integer", "formInput");
		const ruleFloat = new Rule("float", "formInput");
		const ruleString = new Rule("string", "formInput");

		beforeAll(() => {
			ruleInteger.equal(5);
			ruleFloat.equal(5.0);
			ruleString.equal("5.0");
		});

		it("should return false when value is not equal (loose equality)", () => {
			expect(ruleInteger.checkRule(() => 5.9)).toMatchObject({
				passed: false,
			});
			expect(ruleFloat.checkRule(() => 5.1)).toMatchObject({
				passed: false,
			});
			expect(ruleString.checkRule(() => 5.1)).toMatchObject({
				passed: false,
			});
			expect(ruleString.checkRule(() => "5.1")).toMatchObject({
				passed: false,
			});
		});

		it("should return pass when values are equal", () => {
			expect(ruleInteger.checkRule(() => 5)).toMatchObject({
				passed: true,
			});
			expect(ruleFloat.checkRule(() => 5)).toMatchObject({
				passed: true,
			});
			expect(ruleString.checkRule(() => 5)).toMatchObject({
				passed: true,
			});
			expect(ruleString.checkRule(() => "5.0")).toMatchObject({
				passed: true,
			});
		});
	});

	describe("greaterThan", () => {
		const ruleInteger = new Rule("integer", "formInput");
		const ruleFloat = new Rule("float", "formInput");

		beforeAll(() => {
			ruleInteger.greaterThan(5);
			ruleFloat.greaterThan(5.0);
		});

		it("should return false when value is not greater than", () => {
			expect(ruleInteger.checkRule(() => 5.0)).toMatchObject({
				passed: false,
			});
			expect(ruleFloat.checkRule(() => 5.0)).toMatchObject({
				passed: false,
			});
			expect(ruleInteger.checkRule(() => "5.0")).toMatchObject({
				passed: false,
			});
			expect(ruleFloat.checkRule(() => "5.0")).toMatchObject({
				passed: false,
			});
			expect(ruleInteger.checkRule(() => 4.9)).toMatchObject({
				passed: false,
			});
			expect(ruleFloat.checkRule(() => 4.9)).toMatchObject({
				passed: false,
			});
			expect(ruleInteger.checkRule(() => "4.9")).toMatchObject({
				passed: false,
			});
			expect(ruleFloat.checkRule(() => "4.9")).toMatchObject({
				passed: false,
			});
		});

		it("should return pass when values are greater than", () => {
			expect(ruleInteger.checkRule(() => 5.1)).toMatchObject({
				passed: true,
			});
			expect(ruleFloat.checkRule(() => 5.1)).toMatchObject({
				passed: true,
			});
			expect(ruleInteger.checkRule(() => "5.1")).toMatchObject({
				passed: true,
			});
			expect(ruleFloat.checkRule(() => "5.1")).toMatchObject({
				passed: true,
			});
		});
	});

	describe("lessThan", () => {
		const ruleInteger = new Rule("integer", "formInput");
		const ruleFloat = new Rule("float", "formInput");

		beforeAll(() => {
			ruleInteger.lessThan(5);
			ruleFloat.lessThan(5.0);
		});

		it("should return false when value is not less than", () => {
			expect(ruleInteger.checkRule(() => 5.0)).toMatchObject({
				passed: false,
			});
			expect(ruleFloat.checkRule(() => 5.0)).toMatchObject({
				passed: false,
			});
			expect(ruleInteger.checkRule(() => "5.0")).toMatchObject({
				passed: false,
			});
			expect(ruleFloat.checkRule(() => "5.0")).toMatchObject({
				passed: false,
			});
			expect(ruleInteger.checkRule(() => 5.1)).toMatchObject({
				passed: false,
			});
			expect(ruleFloat.checkRule(() => 5.1)).toMatchObject({
				passed: false,
			});
			expect(ruleInteger.checkRule(() => "5.1")).toMatchObject({
				passed: false,
			});
			expect(ruleFloat.checkRule(() => "5.1")).toMatchObject({
				passed: false,
			});
		});

		it("should return pass when values are less than", () => {
			expect(ruleInteger.checkRule(() => 4.9)).toMatchObject({
				passed: true,
			});
			expect(ruleFloat.checkRule(() => 4.9)).toMatchObject({
				passed: true,
			});
			expect(ruleInteger.checkRule(() => "4.9")).toMatchObject({
				passed: true,
			});
			expect(ruleFloat.checkRule(() => "4.9")).toMatchObject({
				passed: true,
			});
		});
	});

	describe("isInteger", () => {
		const rule = new Rule("integer", "formInput");

		beforeAll(() => {
			rule.isInteger();
		});

		it("should return false if value cannot be converted into integer", () => {
			expect(rule.checkRule(() => "one")).toMatchObject({
				passed: false,
			});
			expect(rule.checkRule(() => "oranges 40")).toMatchObject({
				passed: false,
			});
		});

		it("should return true if value can be converted into integer", () => {
			expect(rule.checkRule(() => "40")).toMatchObject({ passed: true });
			expect(rule.checkRule(() => 40)).toMatchObject({ passed: true });
		});
	});

	describe("isFloat", () => {
		const rule = new Rule("float", "formInput");

		beforeAll(() => {
			rule.isFloat();
		});

		it("should return false if value cannot be converted into float", () => {
			expect(rule.checkRule(() => "one")).toMatchObject({
				passed: false,
			});
			expect(rule.checkRule(() => "oranges 40")).toMatchObject({
				passed: false,
			});
		});

		it("should return true if value can be converted into float", () => {
			expect(rule.checkRule(() => "40")).toMatchObject({ passed: true });
			expect(rule.checkRule(() => 40.1)).toMatchObject({ passed: true });
		});
	});
});
