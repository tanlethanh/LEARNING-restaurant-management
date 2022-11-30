import express, { Router } from 'express';
import HomepageController from '../../controllers/HomepageController'
const indexRoute: Router = express.Router()
indexRoute
    .get("/", HomepageController.getHomepageView)
    .get("/menu")
    .get("/reservation", HomepageController.getHomepageReservationView)
    .post("/reservation")

export default indexRoute