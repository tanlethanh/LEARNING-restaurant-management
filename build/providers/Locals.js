"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const dotenv = __importStar(require("dotenv"));
class Locals {
    /**
     * Makes env configs available for your app
     * throughout the app's runtime
     */
    static config() {
        dotenv.config({ path: path.join(__dirname, '../../.env') });
        const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
        const port = process.env.PORT || 4040;
        const appSecret = process.env.APP_SECRET || 'This is your responsibility!';
        const mongooseUrl = process.env.MONGOOSE_URL;
        const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || '50mb';
        const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT || '50mb';
        const name = process.env.APP_NAME || 'NodeTS Dashboard';
        const keywords = process.env.APP_KEYWORDS || 'somethings';
        const year = (new Date()).getFullYear();
        const copyright = `Copyright ${year} ${name} | All Rights Reserved`;
        const company = process.env.COMPANY_NAME || 'GeekyAnts';
        const description = process.env.APP_DESCRIPTION || 'Here goes the app description';
        const isCORSEnabled = process.env.CORS_ENABLED || true;
        const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 3;
        const apiPrefix = process.env.API_PREFIX || 'api';
        const logDays = process.env.LOG_DAYS || 10;
        const queueMonitor = process.env.QUEUE_HTTP_ENABLED || true;
        const queueMonitorHttpPort = process.env.QUEUE_HTTP_PORT || 5550;
        const redisHttpPort = process.env.REDIS_QUEUE_PORT || 6379;
        const redisHttpHost = process.env.REDIS_QUEUE_HOST || '127.0.0.1';
        const redisPrefix = process.env.REDIS_QUEUE_DB || 'q';
        const redisDB = process.env.REDIS_QUEUE_PREFIX || 3;
        return {
            appSecret,
            apiPrefix,
            company,
            copyright,
            description,
            isCORSEnabled,
            jwtExpiresIn,
            keywords,
            logDays,
            maxUploadLimit,
            maxParameterLimit,
            mongooseUrl,
            name,
            port,
            redisDB,
            redisHttpPort,
            redisHttpHost,
            redisPrefix,
            url,
            queueMonitor,
            queueMonitorHttpPort
        };
    }
    /**
     * Injects your config to the app's locals
     */
    static mountEnvConfig(_express) {
        _express.locals.app = this.config();
        return _express;
    }
}
exports.default = Locals;
