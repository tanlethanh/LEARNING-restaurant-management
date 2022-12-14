import { Request, Response } from "express";
import UserRepository from '../repositories/UserRepository'
import { User, UserRole } from '@prisma/client'
import { createJWT, attachCookiesToResponse, createRefreshJWT, } from "../utils/jwtUtils";

class AuthController {
    public static getLoginView(req: Request, res: Response) {
        return res.render('pages/login/index.ejs', { Error_message: "" })
    }
    public static async postLoginInfo(req: Request, res: Response) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.render('pages/login/index.ejs', { Error_message: "Please provide username and password" })
        }
        // find user
        const user: (User | null) = await UserRepository.getUserByUsername(username);

        // check existing
        if (!user) {
            return res.render('pages/login/index.ejs', { Error_message: "User not found" })
        }

        // check password
        const isPasswordCorrect = await UserRepository.checkPassword(user.password, password);
        if (!isPasswordCorrect) {
            return res.render('pages/login/index.ejs', { Error_message: "Invalid password" })

        }

        // create token
        const tokenData = { firstName: user.firstName, role: user.role, id: user.id };
        const token = createJWT(tokenData);
        const refreshToken = createRefreshJWT(tokenData);
        // attach token to cookie
        attachCookiesToResponse(res, token, refreshToken);

        if (tokenData.role == UserRole.ADMIN || tokenData.role == UserRole.MANAGER) {
            return res.redirect('/dashboard')
        }
        else if (tokenData.role == UserRole.CLERK) {
            return res.redirect(`/table-management/${user.id}`)
        }

    }
    public static getLogout(req: Request, res: Response) {
        res.cookie("token", "token", {
            httpOnly: true,
            expires: new Date(Date.now()),
        });
        res.cookie("refreshToken", "refreshToken", {
            httpOnly: true,
            expires: new Date(Date.now()),
        });
        return res.render('pages/login/index.ejs', { Error_message: "Log out successfully" })
    }

}

export default AuthController