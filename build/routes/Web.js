"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const indexRoute_1 = __importDefault(require("./webRoute/indexRoute"));
const dashboardRoute_1 = __importDefault(require("./webRoute/dashboardRoute"));
const tableManagementRoute_1 = __importDefault(require("./webRoute/tableManagementRoute"));
const authRoute_1 = __importDefault(require("./webRoute/authRoute"));
class WebRoute {
    static mountRoute(_express) {
        _express.use("/", indexRoute_1.default);
        _express.use("/dashboard", dashboardRoute_1.default);
        _express.use("/table-management", tableManagementRoute_1.default);
        _express.use("/auth", authRoute_1.default);
    }
}
exports.default = WebRoute;
