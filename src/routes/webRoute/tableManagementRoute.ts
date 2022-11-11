import express, { Router } from 'express';

const tableManagementRoute: Router = express.Router()
tableManagementRoute
    .get("/")
    .post("/")
    .get("/:id")
    .post("/:id")
    .delete("/:id")
    .patch("/:id")


export default tableManagementRoute