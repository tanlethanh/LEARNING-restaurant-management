// In this module, we will set up locked table automately

import Locals from "../providers/Locals"
import { getHoursAndMinutesString } from "../utils/dateUtils"
import ReservationRepository from '../repositories/ReservationRepository'
import { ReservationState } from "@prisma/client"
import PrismaDB from "../prisma/PrismaDB"
import OperationService from "./OperationService"

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
        console.log("Current time ", timeToAssign)
        console.log(timeToAssign.getSeconds() + Locals.config().automateDurationInSeconds)
        timeToAssign.setSeconds(timeToAssign.getSeconds() + Locals.config().automateDurationInSeconds)
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
            }
            else {
                const updatedReservation = await OperationService.assignTableForReservation(reservations[i].id, suitableTable.id)
                console.log("Assigned reservation: ", updatedReservation)
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
            console.log(result)
            console.log("\n___________________  End assign  ___________________\n\n")
        }, Locals.config().automateDurationInSeconds * 1000)
        return timeId
    }

}