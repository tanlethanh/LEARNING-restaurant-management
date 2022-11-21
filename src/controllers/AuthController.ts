import { Request, Response } from "express";

class AuthController{
    public static getLoginView (req:Request, res: Response){
        return res.render('pages/login/index.ejs')
    }
}

export default AuthController