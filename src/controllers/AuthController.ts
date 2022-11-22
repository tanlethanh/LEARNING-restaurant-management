import { Request, Response } from "express";
import UserRepository from '../repositories/UserRepository'
import {User}from '@prisma/client'
import {createJWT,isTokenValid,attachCookiesToResponse, createRefreshJWT,} from "../utils/jwtUtils";

class AuthController{
    public static getLoginView (req:Request, res: Response){
        return res.render('pages/login/index.ejs')
    }
    public static async postLoginInfo (req:Request, res: Response){
        const {username, password} = req.body;
        
        if(!username || !password){
            res.redirect('/auth/login');
        }
        // find user
        const user:(User | null) = await UserRepository.getUserByUsername(username);

        // check existing
        if(!user){
            throw new Error("User not found");
        }

        // check password
        const isPasswordCorrect = await UserRepository.checkPassword(user.password, password);
        if(!isPasswordCorrect){
            throw new Error("Invalid password");
        }

        // create token
        const tokenData = {firstName:user.firstName, role:user.role, id:user.id};
        const token = createJWT(tokenData);
        const refreshToken = createRefreshJWT(tokenData);
        // attach token to cookie
        attachCookiesToResponse(res, token, refreshToken);

        return res.render('pages/ok/index.ejs')
    }
    public static getLogout (req: Request, res: Response){
        // res.cookie("token", "token", {
        //     httpOnly: true,
        //     expires: new Date(Date.now()),
        //   });
        // res.cookie("refreshToken", "refreshToken", {
        //     httpOnly: true,
        //     expires: new Date(Date.now()),
        // });
        // return res.redirect('/auth/login');
        return res.render('pages/ok/index.ejs')
    }

}

export default AuthController