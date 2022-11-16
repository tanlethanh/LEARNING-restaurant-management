import PrismaDB from "../prisma/PrismaDB"
import { Prisma, ReservationState } from "@prisma/client"
import { endToday, startToday } from "../utils/dateUtils"

class ReservationRepository {

    public async addNewReservation(time: Date, numberOfPeople: number, customerId: string, tableId: string) {
        const reservationData: Prisma.ReservationCreateInput = {
            createdDate: undefined,
            updatedDate: undefined,
            time: time,
            numberOfPeople: numberOfPeople,
            state: ReservationState.INIT,
            assignedTable: {
                connect: { id: tableId }
            },
            customer: {
                connect: { customerId: customerId }
            }
        }
        const reservation = await PrismaDB.reservation.create({
            data: reservationData,
            include: {
                customer: true,
                assignedTable: true
            }
        })
        return reservation
    }

    public async getAllReservationsToday() {
        const reservatiosn = await PrismaDB.reservation.findMany({
            where: {
                time: {
                    gte: startToday(),
                    lte: endToday()
                }

            },
            include: {
                assignedTable: {
                    select: {
                        tableNumber: true,
                        id: true
                    }
                },
                customer: true
            }
        })
        return reservatiosn
    }

    public async getReservationById(id: string) {
        return await PrismaDB.reservation.findUnique({
            where: {
                id: id
            },
            include: {
                assignedTable: true
            }
        })
    }

    public async assignTableForReservationById(id: string, tableId: string) {
        return await PrismaDB.reservation.update({
            where: {
                id: id
            },
            data: {
                assignedTable: {
                    connect: { id: tableId }
                },
                updatedDate: new Date(),
                state: ReservationState.ASSIGNED
            }
        })
    }
}

export default new ReservationRepository