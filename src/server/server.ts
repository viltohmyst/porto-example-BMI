/*
 * Since this application is a small application (only a single route), it would
 * be overkill to import an external dependency for web framework (such as express.js),
 * hence we just use the native node.js provided libararies.
 */
import * as url from "url";
import { URLValidator } from "../util";
import { bmiCalculator, bmiClassifier } from "../bmi-calculator";
import { RequestListener } from "http";

export const Server: RequestListener = (request, response) => {
	//Callbacks for handling "General Errors"
	request.on("error", (err) => {
		console.error(err);
		response.statusCode = 400;
		response.end();
	});

	response.on("error", (err) => {
		console.error(err);
	});

	//parse the URL to handle routing and check for existence of queries
	const parsedURL = new url.URL(
		request.url,
		`http://${request.headers.host}`
	);

	//Only handle GET methods and the pathname "/"
	//All other methods and urls are returned with a 404 code
	if (request.method === "GET" && parsedURL.pathname === "/") {
		//Create url validator to check the correctness of API endpoint inputs from the client
		//which is a height and weight, each have to be a number and within a sane range
		const urlValidator = new URLValidator();
		urlValidator.shouldHaveNumberofQuery(2);
		urlValidator
			.shouldHaveQuery("height")
			.isFloat()
			.greaterThan(50)
			.lessThan(300);
		urlValidator
			.shouldHaveQuery("weight")
			.isFloat()
			.greaterThan(20)
			.lessThan(300);

		const result = urlValidator.checkURLValidity(parsedURL);
		if (result.passed === false) {
			response.statusCode = 422;
			response.write(`Error Description:\r\n${result.errorMessage}`);
			response.end();
		} else {
			const height = parseFloat(parsedURL.searchParams.get("height"));
			const weight = parseFloat(parsedURL.searchParams.get("weight"));
			const bmi = bmiCalculator(height, weight);
			const label = bmiClassifier(bmi);
			const returnObj = { bmi, label };
			response.statusCode = 200;
			response.write(JSON.stringify(returnObj));
			response.end();
		}
	} else {
		response.statusCode = 404;
		response.end();
	}
};
