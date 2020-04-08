import * as http from "http";
import { Server } from "./server";

const port = process.env.PORT || 3000;

const App = http.createServer(Server);
console.log(`Server running on port: ${port}`);
App.listen(port);
