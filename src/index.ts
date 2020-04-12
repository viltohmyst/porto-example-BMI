/**
 * The proto-example-bmi App
 *
 * This app show-cases how a nodejs + typescript
 *  + Jest + Supertest + Docker may be configured
 * along with several different typescript language features.
 *
 * @file   This is the main entry file of the program
 * @author M. Hakim Adiprasetya
 */

import { Server } from "./server";

const port = parseInt(process.env.PORT) || 3000;
const App = new Server();
console.log(`Server running on port: ${port}`);

// cleanup function when server should shutdown
function shutdown() {
	App.getServer().close(function onServerClosed(err) {
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
