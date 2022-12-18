import { Application } from "express";
import Locals from "../providers/Locals";
import manageTableRoute from "./apitRoute/manageTableRoute";
import operationRoute from "./apitRoute/operationsRoute";

class ApiRoute {

    public static mountRoute(_express: Application) {
        _express.use("/api/operations", operationRoute)
        _express.use("/api/table-management", manageTableRoute)
    }

}

export default ApiRoute