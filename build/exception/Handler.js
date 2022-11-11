"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = __importDefault(require("../middlewares/Log"));
const Locals_1 = __importDefault(require("../providers/Locals"));
class Handler {
    /**
     * Handles all the not found routes
     */
    static useNotFoundHandler(req, res) {
        const apiPrefix = Locals_1.default.config().apiPrefix;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        Log_1.default.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`);
        if (req.xhr || req.originalUrl.includes(`/${apiPrefix}/`)) {
            return res.json({
                error: 'Page Not Found'
            });
        }
        else {
            res.status(404);
            return res.render('pages/error', {
                title: 'Page Not Found',
                error: []
            });
        }
    }
    /**
     * Register your error / exception monitoring
     * tools right here ie. before "next(err)"!
     */
    static useLogErrors(err, req, res, next) {
        Log_1.default.error(err.message);
        return next(err);
    }
    /**
     * Handles your api/web routes errors/exception
     */
    static useClientErrorHandler(err, req, res, next) {
        if (req.xhr) {
            Log_1.default.error(`Client error - ${err.message}`);
            return res.status(500).send({ error: 'Something went wrong!' });
        }
        else {
            return next(err);
        }
    }
    /**
     * Show undermaintenance page incase of errors
     */
    static useErrorHandler(err, req, res, next) {
        Log_1.default.error(`Server error - ${err.message}`);
        res.status(500);
        const apiPrefix = Locals_1.default.config().apiPrefix;
        if (req.originalUrl.includes(`/${apiPrefix}/`)) {
            if (err.name && err.name === 'UnauthorizedError') {
                const innerMessage = err.message ? err.message : undefined;
                return res.json({
                    error: [
                        'Invalid Token!',
                        innerMessage
                    ]
                });
            }
            return res.json({
                error: err
            });
        }
        return res.render('pages/error', { error: err.stack, title: 'Under Maintenance' });
    }
}
exports.default = Handler;
