import express, { Router } from 'express';
import AuthController from '../../controllers/AuthController'
import { authUser, authAdmin, authClerk, authManager } from '../../services/AuthService'

const authRoute: Router = express.Router()
authRoute
    .get("/login", AuthController.getLoginView)
    .post("/login", AuthController.postLoginInfo)
    .get("/signup")
    .post("/signup")
    .get("/logout", authUser, AuthController.getLogout)

export default authRoute