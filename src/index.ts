
import ExpressApp from "./providers/Express";
import http from 'http'
import Locals from './providers/Locals'
import Socket from "./providers/Socket";

import { createScenario } from "./services/AutomateOperation.test";


const expressApp = new ExpressApp()
const server = http.createServer(expressApp.app)

Socket.init(server)

// createScenario(() => {
//     Socket.pushRefresh()
// }) 

console.log("Init restarant projects")

// Start the server on the specified port
const PORT = Locals.config().port
server.listen(PORT, () => {

    return console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
}).on('error', (_error: Error) => {
    return console.log('Error: ', _error.message);
});




