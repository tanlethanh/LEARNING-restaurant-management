"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CORS_1 = __importDefault(require("./CORS"));
const Http_1 = __importDefault(require("./Http"));
const Views_1 = __importDefault(require("./Views"));
const Statics_1 = __importDefault(require("./Statics"));
const StatusMonitor_1 = __importDefault(require("./StatusMonitor"));
const Locals_1 = __importDefault(require("../providers/Locals"));
class Kernel {
    static mountMidlewares(_express) {
        // Check if CORS is enabled
        if (Locals_1.default.config().isCORSEnabled) {
            // Mount CORS middleware
            CORS_1.default.mount(_express);
        }
        // Mount basic express apis middleware
        Http_1.default.mount(_express);
        // Mount view engine middleware
        Views_1.default.mount(_express);
        // Mount statics middleware
        Statics_1.default.mount(_express);
        // Mount status monitor middleware
        StatusMonitor_1.default.mount(_express);
    }
}
exports.default = Kernel;
