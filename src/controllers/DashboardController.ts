import { Request, Response } from "express";
import OperationService from "../services/OperationService";

class DashboardController {
    public static async getDashboardView (req: Request, res: Response, next: Function) {
        const tables = await OperationService.getAllTables()
        const reservations = await OperationService.getAllReservationsToday()
        return res.render('pages/dashboard/operation-page', {
            tables: tables,
            reservations: reservations
        })
    }
}

export default DashboardController