import * as url from "url";
import { URLValidator } from "./urlValidator";

describe("URL Validator", () => {
	describe("URLValidator", () => {
		const testUrl = new url.URL(
			"http://test.example.com:8080/path?first=1&second=2&third=third"
		);
		describe("shouldHaveNumberofQuery", () => {
			it("should return false if there is more or less than the number of queries", () => {
				const urlValidator = new URLValidator();
				urlValidator.shouldHaveNumberofQuery(2);
				expect(urlValidator.checkURLValidity(testUrl)).toMatchObject({
					passed: false,
				});
				urlValidator.shouldHaveNumberofQuery(4);
				expect(urlValidator.checkURLValidity(testUrl)).toMatchObject({
					passed: false,
				});
			});

			it("should return true if the number of queries are exactly the same amount", () => {
				const urlValidator = new URLValidator();
				urlValidator.shouldHaveNumberofQuery(3);
				expect(urlValidator.checkURLValidity(testUrl)).toMatchObject({
					passed: true,
				});
			});
		});

		describe("shouldHaveQuery", () => {
			it("should return false if no query parameter exists", () => {
				const urlValidator = new URLValidator();
				urlValidator.shouldHaveQuery("fourth");
				expect(urlValidator.checkURLValidity(testUrl)).toMatchObject({
					passed: false,
				});
			});

			it("should return false if the query exists but the rule does not match", () => {
				const urlValidator = new URLValidator();
				urlValidator.shouldHaveQuery("third").isInteger();
				expect(urlValidator.checkURLValidity(testUrl)).toMatchObject({
					passed: false,
				});
			});

			it("should return false if at least one query does not exist or doesn't match the rules", () => {
				const urlValidator = new URLValidator();
				urlValidator.shouldHaveQuery("third").equal("third");
				urlValidator
					.shouldHaveQuery("second")
					.greaterThan(0)
					.lessThan(3)
					.isInteger();
				urlValidator.shouldHaveQuery("first").greaterThan(5);
				expect(urlValidator.checkURLValidity(testUrl)).toMatchObject({
					passed: false,
				});
			});

			it("should return false if all queries exist and match but number of queries do not", () => {
				const urlValidator = new URLValidator();
				urlValidator.shouldHaveQuery("third").equal("third");
				urlValidator
					.shouldHaveQuery("second")
					.greaterThan(0)
					.lessThan(3)
					.isInteger();
				urlValidator.shouldHaveQuery("first").greaterThan(0);
				urlValidator.shouldHaveNumberofQuery(1);
				expect(urlValidator.checkURLValidity(testUrl)).toMatchObject({
					passed: false,
				});
			});

			it("should return pass if the query exists and the rule matches", () => {
				const urlValidator = new URLValidator();
				urlValidator
					.shouldHaveQuery("second")
					.greaterThan(0)
					.lessThan(3)
					.isInteger();
				expect(urlValidator.checkURLValidity(testUrl)).toMatchObject({
					passed: true,
				});
			});

			it("should return pass if all queries exist and match", () => {
				const urlValidator = new URLValidator();
				urlValidator.shouldHaveQuery("third").equal("third");
				urlValidator
					.shouldHaveQuery("second")
					.greaterThan(0)
					.lessThan(3)
					.isInteger();
				urlValidator.shouldHaveQuery("first").greaterThan(0);
				expect(urlValidator.checkURLValidity(testUrl)).toMatchObject({
					passed: true,
				});
			});

			it("should return pass if number of queries is correct and queries rules match", () => {
				const urlValidator = new URLValidator();
				urlValidator.shouldHaveQuery("third").equal("third");
				urlValidator
					.shouldHaveQuery("second")
					.greaterThan(0)
					.lessThan(3)
					.isInteger();
				urlValidator.shouldHaveQuery("first").greaterThan(0);
				urlValidator.shouldHaveNumberofQuery(3);
				expect(urlValidator.checkURLValidity(testUrl)).toMatchObject({
					passed: true,
				});
			});
		});
	});
});
