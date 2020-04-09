// Unit test to test the API endpoint
import { Server } from "./server";
import request from "supertest";
import * as http from "http";

let App: http.Server;
let mockRequest: request.SuperTest<request.Test>;
describe("Endpoint Test", () => {
	beforeAll(() => {
		App = http.createServer(Server);
		mockRequest = request(App);
	});
	describe("Healthcheck : /healthz", () => {
		it("should return status Ok 200 when server is up and running", (done) => {
			mockRequest
				.get("/healthz")
				.expect(200)
				.end(function (err, res) {
					if (err) return done(err);
					done();
				});
		});
	});

	describe("Index Path : /", () => {
		it("should return status Ok 200 with normal label when using valid inputs", (done) => {
			mockRequest
				.get("/")
				.set("Accept", "application/json")
				.query({ height: 170, weight: 70 })
				.expect(200)
				.end(function (err, res) {
					if (err) {
						return done(err);
					} else {
						expect(res.body).toMatchObject({
							bmi: 24.22,
							label: "normal",
						});
						done();
					}
				});
		});

		it("should return status Ok 200 with overweight label when using valid inputs", (done) => {
			mockRequest
				.get("/")
				.set("Accept", "application/json")
				.query({ height: 170, weight: 100 })
				.expect(200)
				.end(function (err, res) {
					if (err) {
						return done(err);
					} else {
						expect(res.body).toMatchObject({
							bmi: 34.6,
							label: "overweight",
						});
						done();
					}
				});
		});

		it("should return status Ok 200 with underweight label when using valid inputs", (done) => {
			mockRequest
				.get("/")
				.set("Accept", "application/json")
				.query({ height: 170, weight: 50 })
				.expect(200)
				.end(function (err, res) {
					if (err) {
						return done(err);
					} else {
						expect(res.body).toMatchObject({
							bmi: 17.3,
							label: "underweight",
						});
						done();
					}
				});
		});

		it("should return error status 422 when providing invalid inputs (less than)", (done) => {
			mockRequest
				.get("/")
				.set("Accept", "application/json")
				.query({ height: 30, weight: 30 })
				.expect(422)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					done();
				});
		});

		it("should return error status 422 when providing invalid inputs (greater than)", (done) => {
			mockRequest
				.get("/")
				.set("Accept", "application/json")
				.query({ height: 300, weight: 300 })
				.expect(422)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					done();
				});
		});

		it("should return error status 422 when providing invalid inputs (not float)", (done) => {
			mockRequest
				.get("/")
				.set("Accept", "application/json")
				.query({ height: "notfloat", weight: "notfloat" })
				.expect(422)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					done();
				});
		});

		it("should return error status 422 when providing invalid inputs (invalid number of query params)", (done) => {
			mockRequest
				.get("/")
				.set("Accept", "application/json")
				.query({
					height: "notfloat",
					weight: "notfloat",
					badquery: "toomanyqueries",
				})
				.expect(422)
				.end(function (err, res) {
					if (err) {
						return done(err);
					}
					done();
				});
		});
	});
});
