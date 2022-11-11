import { Application } from "express";
import indexRoute from "./webRoute/indexRoute";
import dashboardRoute from "./webRoute/dashboardRoute";
import tableManagementRoute from "./webRoute/tableManagementRoute";
import authRoute from "./webRoute/authRoute";

class WebRoute {

    public static mountRoute(_express: Application) {
        _express.use("/", indexRoute)
        _express.use("/dashboard", dashboardRoute)
        _express.use("/table-management", tableManagementRoute)
        _express.use("/auth", authRoute)
    }

}

export default WebRoute