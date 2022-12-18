import express, { Router } from 'express';
import TableManagementController from '../../controllers/TableManagementController';
import { authUser, authClerk } from '../../services/AuthService';

const tableManagementRoute: Router = express.Router()
tableManagementRoute
    // table list page
    .get("/:clerk_id", authUser, authClerk, TableManagementController.getMangagePage)
    // table page
    .get("/table/:order_id", authUser, authClerk, TableManagementController.getMenuPage)

export default tableManagementRoute