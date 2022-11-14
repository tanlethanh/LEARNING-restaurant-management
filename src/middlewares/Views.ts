/**
 * Defines the view engines
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import * as path from 'path';
import { Application } from 'express';

import Log from './Log';

class Views {
	public static mount(_express: Application) {
		Log.info('Booting the \'Views\' middleware...');

		_express.set('view engine', 'ejs');
		_express.set('views', path.join(__dirname, '../../views'));
		_express.locals.pretty = true;

	}
}

export default Views;
