"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Locals_1 = __importDefault(require("./Locals"));
const Api_1 = __importDefault(require("../routes/Api"));
const Web_1 = __importDefault(require("../routes/Web"));
const Kernel_1 = __importDefault(require("../middlewares/Kernel"));
const Handler_1 = __importDefault(require("../exception/Handler"));
class ExpressApp {
    constructor() {
        // Order of all mount methods is important!
        this.app = (0, express_1.default)();
        this.mountEnv();
        this.moutMidlewares();
        this.mountRoutes();
        this.mountExceptionHander();
    }
    initApp() {
        // Start the server on the specified port
        const PORT = Locals_1.default.config().port;
        this.app.listen(PORT, () => {
            return console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
        }).on('error', (_error) => {
            return console.log('Error: ', _error.message);
        });
    }
    mountEnv() {
        Locals_1.default.mountEnvConfig(this.app);
    }
    moutMidlewares() {
        Kernel_1.default.mountMidlewares(this.app);
    }
    mountRoutes() {
        Api_1.default.mountRoute(this.app);
        Web_1.default.mountRoute(this.app);
    }
    mountExceptionHander() {
        this.app.use("*", Handler_1.default.useNotFoundHandler);
        this.app.use(Handler_1.default.useLogErrors);
        this.app.use(Handler_1.default.useClientErrorHandler);
        this.app.use(Handler_1.default.useErrorHandler);
    }
}
exports.default = new ExpressApp;
