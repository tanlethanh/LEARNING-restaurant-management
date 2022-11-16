import { ReservationState } from '@prisma/client';
import { BookedCustomer, Customer, CustomerType, Table, Reservation } from '@prisma/client';
import CustomerRepository from "../repositories/CustomerRepository"
import ReservationRepository from '../repositories/ReservationRepository';
import TableRepository from "../repositories/TableRepository"
import { isInNowToEndDay } from '../utils/dateUtils';

const DEFAUT_TABLE_ID = "f60db947-aa07-4108-8eb1-ff64a3821668"
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
        if (count == 0
            && reservation.assignedTableId == DEFAUT_TABLE_ID
            && reservation.state == ReservationState.INIT
            && reservation.numberOfPeople <= table.numberOfSeats
        ) {
            return await ReservationRepository.assignTableForReservationById(reservation.id, table.id)
        }
        else {
            throw new Error(`Cannot assign table ${table.tableNumber} for reservation ${reservation.id}`)
        }
    }


}

export default new OperationService