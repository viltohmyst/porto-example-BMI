// Unit test to test the API endpoint
import { MiniWebFramework, route } from "./miniWebFramework";
import request from "supertest";
import * as http from "http";

describe("Endpoint Test", () => {
	describe("Add Route", () => {
		let App: MiniWebFramework;
		let mockRequest: request.SuperTest<request.Test>;

		beforeAll(() => {
			App = new MiniWebFramework();
			mockRequest = request(App.getServer());
		});
		it("should add a new route and return the correct error response", (done) => {
			App.addRoute("/newpath", (request, response) => {
				response.statusCode = 400;
				response.end("hello world");
			});

			mockRequest
				.get("/newpath")
				.expect(400)
				.end(function (err, res) {
					if (err) {
						return done(err);
					} else {
						expect(res.text).toEqual("hello world");
						done();
					}
				});
		});

		it("should add a new route and return the correct non-error response", (done) => {
			App.addRoute("/otherpath", (request, response) => {
				response.statusCode = 200;
				response.setHeader("Content-Type", "application/json");
				response.write(JSON.stringify({ hello: "world" }));
				response.end();
			});

			mockRequest
				.get("/otherpath")
				.expect(200)
				.end(function (err, res) {
					if (err) {
						return done(err);
					} else {
						expect(res.body).toMatchObject({ hello: "world" });
						done();
					}
				});
		});
	});

	describe("Add Route using Decorator", () => {
		class inheritedClass extends MiniWebFramework {
			@route("/newpath")
			someMethod(
				request: http.IncomingMessage,
				response: http.ServerResponse
			) {
				response.statusCode = 400;
				response.end("hello world");
			}

			@route("/otherpath")
			anotherMethod(
				request: http.IncomingMessage,
				response: http.ServerResponse
			) {
				response.statusCode = 200;
				response.setHeader("Content-Type", "application/json");
				response.write(JSON.stringify({ hello: "world" }));
				response.end();
			}
		}
		let App: inheritedClass;
		let mockRequest: request.SuperTest<request.Test>;
		beforeAll(() => {
			App = new inheritedClass();
			mockRequest = request(App.getServer());
		});
		it("should add a new route and return the correct error response", (done) => {
			mockRequest
				.get("/newpath")
				.expect(400)
				.end(function (err, res) {
					if (err) {
						return done(err);
					} else {
						expect(res.text).toEqual("hello world");
						done();
					}
				});
		});

		it("should add a new route and return the correct non-error response", (done) => {
			mockRequest
				.get("/otherpath")
				.expect(200)
				.end(function (err, res) {
					if (err) {
						return done(err);
					} else {
						expect(res.body).toMatchObject({ hello: "world" });
						done();
					}
				});
		});
	});
});
