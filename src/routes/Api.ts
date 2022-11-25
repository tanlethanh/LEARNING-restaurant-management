import { Application } from "express";
import Locals from "../providers/Locals";
import operationRoute from "./apitRoute/operationsRoute";

class ApiRoute {

    public static mountRoute(_express: Application) {
        _express.use("/api/operations", operationRoute)
    }

}

export default ApiRoute