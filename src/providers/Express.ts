import express, { Application} from 'express';
import Locals from './Locals';
import ApiRoute from '../routes/Api';
import WebRoute from '../routes/Web';
import Kernel from '../middlewares/Kernel';
import Handler from '../exception/Handler';

class ExpressApp {

    public app: Application

    constructor() {
        // Order of all mount methods is important!
        this.app = express()
        this.mountEnv()
        this.moutMidlewares()
        this.mountRoutes()
        this.mountExceptionHander()
    }

    public initApp() {
        // Start the server on the specified port
        const PORT = Locals.config().port
        this.app.listen(PORT, () => {
            return console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
        }).on('error', (_error: Error) => {
            return console.log('Error: ', _error.message);
        });
    }

    private mountEnv() {
        Locals.mountEnvConfig(this.app)
    }

    private moutMidlewares() {
        Kernel.mountMidlewares(this.app)
    }

    private mountRoutes() {
        ApiRoute.mountRoute(this.app)
        WebRoute.mountRoute(this.app)
    }

    private mountExceptionHander() {
        this.app.use("*", Handler.useNotFoundHandler)
        this.app.use(Handler.useLogErrors)
        this.app.use(Handler.useClientErrorHandler)
        this.app.use(Handler.useErrorHandler)
    }

}

export default new ExpressApp