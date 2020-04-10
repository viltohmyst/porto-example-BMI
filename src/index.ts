import * as http from "http";
import { Server } from "./server";
import * as debugAgent from "@google-cloud/debug-agent";
import * as profiler from "@google-cloud/profiler";

debugAgent.start({
	serviceContext: {
		service: process.env.SERVICE || "bmi-1",
		version: process.env.VERSION || "1",
	},
});

profiler.start({
	serviceContext: {
		service: process.env.SERVICE || "bmi-1",
		version: process.env.VERSION || "1",
	},
});

const port = process.env.PORT || 3000;

const App = http.createServer(Server);
console.log(`Server running on port: ${port}`);

// cleanup function when server should shutdown
function shutdown() {
	// NOTE: server.close is for express based apps
	// If using hapi, use `server.stop`
	App.close(function onServerClosed(err) {
		if (err) {
			console.error(err);
			process.exitCode = 1;
		}
		process.exit();
	});
}

// quit and perform cleanup on SIGINT (could be from ctrl-c when running docker in terminal)
process.on("SIGINT", function onSigint() {
	console.info(
		"Received SIGINT... Shutting down on time: ",
		new Date().toISOString()
	);
	shutdown();
});

// quit and perform cleanup on SIGTERM (could be from docker stop command)
process.on("SIGTERM", function onSigterm() {
	console.info(
		"Received SIGTERM... Shutting down on time: ",
		new Date().toISOString()
	);
	shutdown();
});

//begin listening to port
App.listen(port);
