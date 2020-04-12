import { MiniWebFramework, route } from "../util/miniWebFramework";
import { IncomingMessage, ServerResponse } from "http";
import { URLValidator } from "../util";
import { bmiCalculator, bmiClassifier } from "../bmi-calculator";
import { URL } from "url";

/**
 * The Server class inherits from the MiniWebFramework and implements
 * the concrete "routes" as well as the endpoint callbacks which
 * make up the application
 *
 * @export
 * @class Server
 * @extends {MiniWebFramework}
 */
export class Server extends MiniWebFramework {
	// The main route where BMI queries will be routed
	@route("/")
	main(request: IncomingMessage, response: ServerResponse) {
		const parsedURL = new URL(
			request.url,
			`http://${request.headers.host}`
		);

		// Handle incoming get requests, if it was a POST or other HTTP method, then implement another if clause
		if (request.method === "GET") {
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
				console.log(result.errorMessage);
			} else {
				const height = parseFloat(parsedURL.searchParams.get("height"));
				const weight = parseFloat(parsedURL.searchParams.get("weight"));
				const bmiResult = bmiCalculator(height, weight);
				const label = bmiClassifier(bmiResult);
				const bmi = parseFloat(bmiResult.toFixed(2));
				const returnObj = { bmi, label };
				response.statusCode = 200;
				response.setHeader("Content-Type", "application/json");
				response.write(JSON.stringify(returnObj));
				response.end();
				console.log("Ok");
			}
		}
	}

	// The route for docker swarm or Kubernetes HTTP healthchecks
	@route("/healthz")
	healthCheck(request: IncomingMessage, response: ServerResponse) {
		if (request.method === "GET") {
			response.statusCode = 200;
			response.end("Healthy status : 200 (server is healthy)");
		}
	}
}
