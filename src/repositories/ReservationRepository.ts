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

    /**
     * 
     * @param state 
     * @param time 
     * @param timePadding (s)
     * @returns 
     */
    public async getAllReservationsInTime(state: ReservationState, time: Date, timePadding: number = 1) {
        const start = new Date(time)
        start.setSeconds(start.getSeconds() - timePadding)
        const end = new Date(time)
        end.setSeconds(end.getSeconds() + timePadding)
        const reservations = await PrismaDB.reservation.findMany({
            where: {
                time: {
                    gte: start,
                    lte: end
                },
                state: {
                    equals: state
                }
            }
        })

        return reservations
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

    public async updateReservationById(id: string, data: Prisma.ReservationUncheckedUpdateInput) {
        data.updatedDate = new Date()
        return await PrismaDB.reservation.update({
            where: {
                id: id
            },
            data: data
        })
    }

    public async updateReservationStateById(reservationId: string, state: ReservationState) {
        const data = {
            state: state
        }
        return this.updateReservationById(reservationId, data)
    }

    public async deleteAllReservationsToday() {
        const result = await PrismaDB.reservation.deleteMany({
            where: {
                time: {
                    gte: startToday(),
                    lte: endToday()
                }
            }
        })
        return result
    }

}

export default new ReservationRepository