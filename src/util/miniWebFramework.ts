import {
	RequestListener,
	Server,
	createServer,
	IncomingMessage,
	ServerResponse,
} from "http";
import { URL } from "url";

import "reflect-metadata";

export type RouteCallback = (
	request: IncomingMessage,
	response: ServerResponse
) => void;

/**
 * This is a decorator function which is used to decorate route callbacks
 * in a child class of MiniWebFramework. It defines which callbacks are
 * called for which paths.
 *
 * @export
 * @param {string} path - the pathname of the rout (i.e. "/" or "/healthcheck")
 * @returns
 */
export function route(path: string) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		Reflect.defineMetadata(
			"route",
			{ path, callback: descriptor.value },
			target,
			propertyKey
		);
	};
}

/**
 * A mini web framework which simplifies the creation of endpoint routes
 * using a @route decorator.
 *
 * @export
 * @class MiniWebFramework
 */
export class MiniWebFramework {
	private routes: { [key: string]: RouteCallback } = {};
	private server: Server;

	constructor() {
		this.server = createServer(this.getRequestListener());
		const parent = Object.getPrototypeOf(this);
		const keys = Object.getOwnPropertyNames(parent);
		for (let key of keys) {
			const data = Reflect.getMetadata("route", this, key);
			if (!!data === true) {
				this.addRoute(data.path, data.callback);
			}
		}
	}

	/**
	 * Gets the http.Server of this MiniWebFramework class
	 *
	 * @returns
	 * @memberof MiniWebFramework
	 */
	public getServer() {
		return this.server;
	}

	/**
	 * Begins the web server application by calling http.Server.listen
	 *
	 * @param {number} port
	 * @memberof MiniWebFramework
	 */
	public listen(port: number) {
		this.server.listen(port);
	}

	private getRequestListener(): RequestListener {
		return (request: IncomingMessage, response: ServerResponse) => {
			// General error handling
			this.handleGeneralError(request, response);

			//parse the URL to handle routing and check for existence of queries
			const parsedURL = new URL(
				request.url,
				`http://${request.headers.host}`
			);

			const route = this.routes[parsedURL.pathname];
			if (!!route) {
				route(request, response);
			} else {
				response.statusCode = 404;
				response.end();
			}
		};
	}

	/**
	 * This method is used to add a new route to the application
	 *
	 * @param {string} path
	 * @param {RouteCallback} route - a callback which defines the actions for a specific endpoint
	 * @memberof MiniWebFramework
	 */
	public addRoute(path: string, route: RouteCallback) {
		if (this.routes === undefined) this.routes = {};
		this.routes[path] = route;
	}

	protected handleGeneralError = (
		request: IncomingMessage,
		response: ServerResponse
	) => {
		request.on("error", (err) => {
			console.error(err);
			response.statusCode = 400;
			response.end();
			console.error(err);
		});

		response.on("error", (err) => {
			console.error(err);
		});
	};
}
