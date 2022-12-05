// In this module, we will set up locked table automately

import Locals from "../providers/Locals"
import { getHoursAndMinutesString } from "../utils/dateUtils"
import ReservationRepository from '../repositories/ReservationRepository'
import { ReservationState, TableState } from "@prisma/client"
import PrismaDB from "../prisma/PrismaDB"
import OperationService from "./OperationService"
import Socket from "../providers/Socket"

export default class AutomateOperation {

    private static getDuration() {
        return Locals.config().automateDuration
    }

    public static getOpenAndCloseTime() {
        const openTime = new Date()
        const closeTime = new Date()
        closeTime.setMinutes(closeTime.getMinutes() + 5)
        return {
            open: getHoursAndMinutesString(openTime),
            close: getHoursAndMinutesString(closeTime)
        }
    }

    /**
     * This method unlock an assigned reservation
     * If state of current table is FREE, lock the table for this reservation
     * Else unlock the reservation for manually locking
     * 
     * @param id 
     */
    public static async autoUnlockAssignedReservation(id: string) {
        const reservation = await ReservationRepository.getReservationById(id)
        if (reservation?.state == ReservationState.ASSIGNED) {
            const table = reservation.assignedTable
            if (!table) {

            }
            else {
                let updatedReservation
                        = await OperationService.changeReservationStateToReady(reservation.id)
                if (table.state == TableState.FREE) {
                    updatedReservation
                        = await OperationService.lockTableForReservation(table.id, reservation.id)
                    Socket.pushNotification({
                        type: "AUTO_UNLOCK",
                        status: 'success',
                        title: 'Xếp chỗ tự động',
                        text: `Bàn số ${table.tableNumber} đã khóa cho khách ${updatedReservation.customer.firstName} | ${updatedReservation.customer.phoneNumber}`,
                        updatedReservation: updatedReservation
                    })
                }
                else {
                    Socket.pushNotification({
                        type: "AUTO_UNLOCK",
                        status: 'warning',
                        title: 'Xếp chỗ tự động',
                        text: `Bàn số ${table.tableNumber} hiện không thể xếp cho ${updatedReservation.customer.firstName} | ${updatedReservation.customer.phoneNumber}. Vui lòng xếp thủ công!`,
                        updatedReservation: updatedReservation
                    })
                }
            }
        }
        else {

        }

    }

    public static async findSuitableTables(reservationTime: Date, numberOfPeople: number) {
        const tables = await PrismaDB.table.findMany({
            where: {
                numberOfSeats: {
                    gte: numberOfPeople
                }
            },
            orderBy: {
                numberOfSeats: "asc"
            },
            include: {
                reservations: {
                    where: {
                        state: ReservationState.ASSIGNED
                    }
                }
            }
        })
        const suitableTables = tables.filter((ele) => {
            return ele.reservations.length == 0
        })
        if (suitableTables.length > 0) {
            return suitableTables[0]
        }
        return null
    }

    public static async autoAssignReservation() {
        const timeToAssign = new Date()
        const automateDurationInSeconds = Locals.config().automateDurationInSeconds
        console.log("Current time ", timeToAssign)
        console.log(timeToAssign.getSeconds() + automateDurationInSeconds)
        timeToAssign.setSeconds(timeToAssign.getSeconds() + automateDurationInSeconds)
        console.log("Assign time ", timeToAssign)
        const reservations
            = await ReservationRepository.getAllReservationsInTime(ReservationState.INIT, timeToAssign, 1)
        let count = 0

        for (let i = 0; i < reservations.length; i++) {
            const suitableTable = await AutomateOperation.findSuitableTables(
                reservations[i].time,
                reservations[i].numberOfPeople
            )

            if (!suitableTable) {
                console.log(`Cannot find suitable table for this reservation ${reservations[i].id}`)
                Socket.pushNotification({
                    type: "AUTO_ASSIGN",
                    status: 'error',
                    title: 'Gán bàn tự động',
                    text: `Không tìm được bàn phù hợp cho
                     ${reservations[i].customer.firstName} | ${reservations[i].numberOfPeople} người`
                })
            }
            else {
                const updatedReservation
                    = await OperationService.assignTableForReservation(reservations[i].id, suitableTable.id)

                setTimeout(() => {
                    AutomateOperation.autoUnlockAssignedReservation(updatedReservation.id)

                }, automateDurationInSeconds * (1 - Locals.config().unlockPercent));

                Socket.pushNotification({
                    type: "AUTO_ASSIGN",
                    status: 'success',
                    title: 'Gán bàn tự động',
                    text: `Đơn đặt ${reservations[i].customer.firstName} | ${reservations[i].customer.phoneNumber} 
                    gán vào ${suitableTable.tableNumber}`,
                    updatedReservation: updatedReservation
                })
                count++
            }

        }

        return {
            count: count,
            reservations: reservations
        }
    }

    public static start() {
        const timeId = setInterval(async () => {
            console.log("___________________ Start assign ___________________\n")
            const result = await AutomateOperation.autoAssignReservation()
            console.log("Assign count: ", result.count)
            console.log("\n___________________  End assign  ___________________\n\n")
        }, Locals.config().automateDurationInSeconds * 1000)
        return timeId
    }

}