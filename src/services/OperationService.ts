import { ReservationState, TableState } from '@prisma/client';
import { BookedCustomer, Customer, CustomerType, Table, Reservation } from '@prisma/client';
import CustomerRepository from "../repositories/CustomerRepository"
import ReservationRepository from '../repositories/ReservationRepository';
import TableRepository from "../repositories/TableRepository"
import { isInNowToEndDay } from '../utils/dateUtils';

const DEFAUT_TABLE_ID = null
class OperationService {

    public async getAllTables() {
        return await TableRepository.getAllSortedTables()
    }

    public async getAllReservationsToday() {
        return await ReservationRepository.getAllReservationsToday()
    }

    public async assignTableForReservation(reservationId: string, tableId: string) {
        const reservation: (Reservation | null)
            = await ReservationRepository.getReservationById(reservationId)
        const table: Table & { reservations: Reservation[] } | null
            = await TableRepository.getTableWithReservationsById(tableId)

        if (table == null || reservation == null) {
            throw new Error("Cannot find table or reservation")
        }

        let count = 0
        table.reservations.forEach(ele => {
            if (isInNowToEndDay(ele.time)) {
                count++
            }
        })

        // Just assign if the table has no reservation from now to end of day
        if (reservation.assignedTableId != DEFAUT_TABLE_ID) {
            throw new Error(`This reservation has been assigned`)
        }
        else if (reservation.state != ReservationState.INIT) {
            throw new Error(`Cannot assign table with state ${reservation.state}, just accept ${ReservationState.INIT}`)
        }
        else if (reservation.numberOfPeople > table.numberOfSeats) {
            throw new Error(`Dont have enough seats`)
        }

        return await ReservationRepository.updateAssignedTableForReservationById(reservation.id, table.id)

    }

    public async cancelReservation(reservationId: string) {
        throw new Error("Method not implemented.");
    }

    public async lockTableForReservation (tableId: string, reservationId: string) {
        const table: (Table & {reservations: Reservation[]}) | null= await TableRepository.getTableWithReservationsById(tableId)
        if (table == null) {
            throw new Error("Cannot find table")
        }
    }

    public async unlockReservation(reservationId: string) {
        const reservation
            = await ReservationRepository.getReservationById(reservationId)
        if (reservation == null) {
            throw new Error(`Reservation id - [${reservationId}]: not found!`)
        }
        else {
            if (reservation.state == ReservationState.ASSIGNED) {
                console.log(ReservationState.READY)
                const updateData = {
                    state: ReservationState.READY
                }
                return await ReservationRepository.updateReservationById(reservationId, updateData)
                
            }
            else {
                throw new Error(`Reservation id - [${reservationId}]: state must be ASSIGNED to change to READY`)
            }
        }

    }

}

export default new OperationService