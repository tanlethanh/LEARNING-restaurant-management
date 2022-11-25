import express, { Router } from 'express';
import DashboardController from '../../controllers/DashboardController';

const operationRoute: Router = express.Router()
operationRoute
    .get("/reservations/:id", DashboardController.updateReservation)
    .post("/reservations/:id", DashboardController.updateReservation)
    // .post("/tables/:id", DashboardController.updateTable)

export default operationRoute