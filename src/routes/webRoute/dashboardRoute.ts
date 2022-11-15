import express, { Router } from 'express';
import DashboardController from '../../controllers/DashboardController';

const dashboardRoute: Router = express.Router()
dashboardRoute
    .get("/", DashboardController.getDashboardView)
    .get("/main", DashboardController.getDashboardView)
    .get("/booking")
    .get("/user")
    .get("/statistic")
    .get("/setting")
    .post("setting")

export default dashboardRoute