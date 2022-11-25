import PrismaDB from "../prisma/PrismaDB"
import { Prisma, ReservationState } from "@prisma/client"
import { endOfDay, endToday, startOfDay, startToday } from "../utils/dateUtils"

class ReservationRepository {

    public async createNewReservation(
        time: Date, numberOfPeople: number,
        customerId: string, tableId: string | undefined = undefined
    ) {
        const reservationData: Prisma.ReservationCreateInput = {
            createdDate: undefined,
            updatedDate: undefined,
            time: time,
            numberOfPeople: numberOfPeople,
            state: ReservationState.INIT,
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

    public async getAllReservationsByStateInDate(
        state: ReservationState | ReservationState[] | null = null, date: Date = new Date()
    ) {
        let states: ReservationState[] = []
        if (Array.isArray(state)) {
            states = state
        }
        else if (state != null) {
            states.push(state)
        }
        
        const reservatiosn = await PrismaDB.reservation.findMany({
            where: {
                time: {
                    gte: startOfDay(date),
                    lte: endOfDay(date)
                },
                state: {
                    in: states
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

    public async updateAssignedTableForReservationById(id: string, tableId: string) {
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
            },
            include: {
                assignedTable: true
            }
        })
    }

    public async updateReservationById(id: string, data: any) {
        data.updatedDate = new Date()
        console.log(data)
        return await PrismaDB.reservation.update({
            where: {
                id: id
            },
            data: data
        })
    }

}

export default new ReservationRepository