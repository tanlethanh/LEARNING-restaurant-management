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
                    updatedReservation = await OperationService.changeReservationStateToReady(reservationId)
                    break
                case "LOCK":
                    updatedReservation = await OperationService.lockTableForReservation(tableId, reservationId)
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
            return res.status(400).json({
                error: error.message
            })
        }
        return res.json({
            reservation: updatedReservation
        })
    }

    public static async initOrder(req: Request, res: Response) {
        const tableId = String(req.query.tableid)
        const reservationId = String(req.query.reservationid)
        let initiatedOrder
        try {
            initiatedOrder = await OperationService.initOrderForReservation(tableId, reservationId)
        }
        catch (error: Error | any) {
            return res.status(400).json({
                error: error.message
            })
        }
        return res.json({
            order: initiatedOrder
        })
    }

    public static async getOrder(req: Request, res: Response) {
        const tableId = String(req.query.tableid)
        
        let curOrder
        try {
            curOrder = await OperationService.getOrderForTable(tableId)
        }
        catch (error: Error | any) {
            return res.status(400).json({
                error: error.message
            })
        }
        return res.json({
            order: curOrder,
        })
    }

    public static updateOrder(req: Request, res: Response) {
        throw new Error('Method not implemented.');
    }

    public static async getDashboardView(req: Request, res: Response, next: Function) {
        const tables = await OperationService.getAllTablesToRender()
        const reservations = await OperationService.getAllReservationsToday()
        return res.render('pages/dashboard/operation-page', {
            tables: tables,
            reservations: reservations
        })
    }

}

export default DashboardController