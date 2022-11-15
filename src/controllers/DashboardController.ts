import { Request, Response } from "express";

class DashboardController {
    public static getDashboardView (req: Request, res: Response, next: Function) {
        return res.render('pages/dashboard/operation-page')
    }
}

export default DashboardController