import { Request, Response } from "express";
import OperationService from "../services/OperationService";

class DashboardController {
    public static async getDashboardView (req: Request, res: Response, next: Function) {
        const tables = await OperationService.getAllTables()
        return res.render('pages/dashboard/operation-page', {
            tables: tables
        })
    }
}

export default DashboardController