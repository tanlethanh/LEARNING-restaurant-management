import { createJWT, isTokenValid, attachCookiesToResponse, createRefreshJWT, } from "../utils/jwtUtils";
import { Prisma, Order, UserRole } from "@prisma/client"
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken"

function isAuthenticated(token: string, refreshToken: string) {
    try {
        const payLoad = isTokenValid(token) as JwtPayload;
        const exp: number = payLoad.exp!;
        // check token out of date
        if (exp < Date.now() * 1000) {
            return false;
        }
    } catch (err) {
        return false;
    }
    return true;
}

const authUser = async (req: Request, res: Response, next: NextFunction) => {
    let token: string = req.cookies.token;
    let refreshToken: string = req.cookies.refreshToken;

    if (!token) {
        return res.redirect('/auth/login')
    }

    try {
        const payLoad = isTokenValid(refreshToken) as JwtPayload;
        const tokenData = { firstName: payLoad.firstName, role: payLoad.role, id: payLoad.id };
        if (!isAuthenticated(token, refreshToken)) {
            // create new token
            token = createJWT(tokenData);
            // create new refrestoken
            refreshToken = createRefreshJWT(tokenData);

            attachCookiesToResponse(res, token, refreshToken);
        }

        // attach the user to the job route
        req.body = tokenData;
    } catch (error) {
        throw new Error("You must login");
    }
    next();
};

const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.role != UserRole.ADMIN) {
        return res.render('pages/login/index.ejs', { Error_message: "You must to log in as admin" })
    }
    next();
}

const authClerk = async (req: Request, res: Response, next: NextFunction) => {

    if (req.body.role == UserRole.CLERK || req.body.role == UserRole.ADMIN || req.body.role == UserRole.MANAGER) {
        return next();
    }

    return res.render('pages/login/index.ejs', { Error_message: "You must to log in as clerk" })
}

const authManager = async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.role != UserRole.MANAGER) {
        return res.render('pages/login/index.ejs', { Error_message: "You must to log in as manager" })
    }
    next();
}

export { authUser, authAdmin, authClerk, authManager }