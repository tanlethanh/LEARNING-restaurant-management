import express, { Router } from 'express';

const authRoute: Router = express.Router()
authRoute
    .get("/login")
    .post("/login")
    .get("/signup")
    .post("/signup")
    .get("/logout")

export default authRoute