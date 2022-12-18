import express from 'express';

import * as path from 'path';
import { Application } from 'express';

import Log from './Log';

class Views {
	public static mount(_express: Application) {
		Log.info('Booting the \'Views\' middleware...');

		_express.set('view engine', 'ejs');
		_express.set('views', path.join(__dirname, '../../views'));
		_express.use(express.static(path.join(__dirname, '../../public')))
		_express.locals.pretty = true;

	}
}

export default Views;
