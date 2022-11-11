"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardRoute = express_1.default.Router();
dashboardRoute
    .get("/")
    .get("/main")
    .get("/booking")
    .get("/user")
    .get("/statistic")
    .get("/setting")
    .post("setting");
exports.default = dashboardRoute;
