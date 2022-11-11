import * as cors from 'cors';
import { Application } from 'express';
import * as bodyParser from 'body-parser';
// import * as flash from 'express-flash';
// import * as compress from 'compression';
// import * as expressValidator from 'express-validator';

import Log from './Log';
import Locals from '../providers/Locals';


class Http {
	public static mount(_express: Application) {
		Log.info('Booting the \'HTTP\' middleware...');

		// Enables the request body parser
		_express.use(bodyParser.json({
			limit: Locals.config().maxUploadLimit
		}));

		_express.use(bodyParser.urlencoded({
			limit: Locals.config().maxUploadLimit,
			parameterLimit: Locals.config().maxParameterLimit,
			extended: false
		}));

		// Disable the x-powered-by header in response
		_express.disable('x-powered-by');
	}
}

export default Http;
