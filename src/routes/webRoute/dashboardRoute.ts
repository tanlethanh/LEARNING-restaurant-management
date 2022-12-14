import express, { Router } from 'express';
import DashboardController from '../../controllers/DashboardController';
import { authUser, authAdmin } from '../../services/AuthService'

const dashboardRoute: Router = express.Router()
dashboardRoute
    .get("/", authUser, authAdmin, DashboardController.getDashboardView)
    .get("/main", authUser, authAdmin, DashboardController.getDashboardView)
    .get("/booking")
    .get("/user")
    .get("/statistic")
    .get("/setting")
    .post("setting")

export default dashboardRoute