import { ReservationState } from "@prisma/client";
import { Request, Response } from "express";
import Log from "../middlewares/Log";
import TableRepository from "../repositories/TableRepository";
import OperationService from "../services/OperationService";

class DashboardController {

    public static async updateReservation(req: Request, res: Response) {
        const action = String(req.query.action).toUpperCase()
        const reservationId = String(req.params.id)
        const tableId = String(req.query.tableid)
        let updatedReservation
        try {
            switch (action) {
                case "ASSIGN":
                    updatedReservation = await OperationService.assignTableForReservation(reservationId, tableId)
                    break
                case "UNLOCK":
                    updatedReservation = await OperationService.unlockReservation(reservationId)
                    break
                case "CANCEL":
                    updatedReservation = await OperationService.cancelReservation(reservationId)
                    break
                default:
                    const message = `Invalid action: action=${action}`
                    Log.error(message)
                    return res.json({
                        error: message
                    })
            }
        }
        catch (error: Error | any) {
            Log.error(error.message)
            return res.json({
                error: error.message
            })
        }
        return res.json({
            reservation: updatedReservation
        })
    }

    // public static async updateTable(req: Request, res: Response) {
    //     const action = String(req.query.action).toUpperCase()
    //     const tableId = String(req.params.id)
    //     const reservationId = String(req.query.reservationid)
    //     try {
    //         // switch (action) {
    //         //     case 'LOCK':
    //         //         // OperationService.
    //         // }
    //     }
    // }

    public static async getDashboardView(req: Request, res: Response, next: Function) {
        const tables = await OperationService.getAllTables()
        const reservations = await OperationService.getAllReservationsToday()
        return res.render('pages/dashboard/operation-page', {
            tables: tables,
            reservations: reservations
        })
    }

    // public static async 
}

export default DashboardController