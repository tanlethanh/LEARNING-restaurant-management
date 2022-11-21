import express, { Router } from 'express';
import AuthController from '../../controllers/AuthController'

const authRoute: Router = express.Router()
authRoute
    .get("/login", AuthController.getLoginView)
    .post("/login")
    .get("/signup")
    .post("/signup")
    .get("/logout")

export default authRoute