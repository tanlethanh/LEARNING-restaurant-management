import express, { Router } from 'express';
import TableManagementController from '../../controllers/TableManagementController';

const tableManagementRoute: Router = express.Router()
tableManagementRoute
    // table list page
    .get("/:clerk_id", TableManagementController.getMangagePage)
    // table page
    .get("/table/:order_id", TableManagementController.getMenuPage)



export default tableManagementRoute