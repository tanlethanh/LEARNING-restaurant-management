import express, { Router } from 'express';


const dashboardRoute: Router = express.Router()
dashboardRoute
    .get("/")
    .get("/main")
    .get("/booking")
    .get("/user")
    .get("/statistic")
    .get("/setting")
    .post("setting")

export default dashboardRoute