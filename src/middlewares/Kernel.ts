import { Application } from 'express';

import CORS from './CORS';
import Http from './Http';
import Views from './Views';
import Statics from './Statics';
import StatusMonitor from './StatusMonitor';

import Locals from '../providers/Locals';

class Kernel {
	public static mountMidlewares (_express: Application) {
		// Check if CORS is enabled
		if (Locals.config().isCORSEnabled) {
			// Mount CORS middleware
			CORS.mount(_express);
		}

		// Mount basic express apis middleware
		Http.mount(_express);

		// Mount view engine middleware
		Views.mount(_express);

		// Mount statics middleware
		Statics.mount(_express);

		// Mount status monitor middleware -> conflict with socket.io
		// StatusMonitor.mount(_express);
	}
}

export default Kernel;
