import express, { Router } from 'express';

const indexRoute: Router = express.Router()
indexRoute
    .get("/")
    .get("/menu")
    .get("/reservation")
    .post("/reservation")

export default indexRoute