import { ReservationState, TableState } from '@prisma/client';
import { BookedCustomer, Customer, CustomerType, Table, Reservation } from '@prisma/client';
import CustomerRepository from "../repositories/CustomerRepository"
import ReservationRepository from '../repositories/ReservationRepository';
import TableRepository, { GetTableOption } from "../repositories/TableRepository"
import { isInNowToEndDay } from '../utils/dateUtils';
import { NotFoundError, MissingConditionError, ResourceName } from '../exception/Error';
import OrderRepository from '../repositories/OrderRepository';

const DEFAUT_TABLE_ID = null
class OperationService {

    constructor() {
        console.log("Init Operation service")
    }

    public async getAllTables() {
        return await TableRepository.getAllSortedTables()
    }

    public async getAllTablesToRender() {
        const allTables = await TableRepository.getAllSortedTables(GetTableOption.FULL)
        console.log(allTables)
        return allTables
    }

    public async getAllReservationsToday() {
        return await ReservationRepository.getAllReservationsToday()
    }

    /**
     * This method assign table for reservation, state of reservation must be INIT
     * the table has enough seats and has no assigned reservation in this time
     * @param reservationId 
     * @param tableId 
     * @returns updated reservation
     */
    public async assignTableForReservation(reservationId: string, tableId: string) {
        const reservation: (Reservation | null)
            = await ReservationRepository.getReservationById(reservationId)
        const table: Table & { reservations: Reservation[] } | null
            = await TableRepository.getTableWithReservationsById(tableId)

        if (table == null) {
            throw new NotFoundError(ResourceName.TABLE, tableId)
        }
        else if (reservation == null) {
            throw new NotFoundError(ResourceName.RESERVATION, reservationId)
        }

        let count = 0
        table.reservations.forEach(ele => {
            if (isInNowToEndDay(ele.time)) {
                count++
            }
        })

        // Just assign if the table has no reservation from now to end of day
        if (reservation.assignedTableId != DEFAUT_TABLE_ID) {
            throw new MissingConditionError(ResourceName.RESERVATION, "This reservation has been assigned")
        }
        else if (reservation.state != ReservationState.INIT) {
            throw new MissingConditionError(ResourceName.RESERVATION, "State must be INIT")
        }
        else if (reservation.numberOfPeople > table.numberOfSeats) {
            throw new MissingConditionError(ResourceName.TABLE, "Table dont't have enough seats")
        }
        else if (count > 0) {
            throw new MissingConditionError(ResourceName.TABLE, "This table is current assigned for another reservation")
        }

        return await ReservationRepository.updateAssignedTableForReservationById(reservation.id, table.id)

    }

    /**
     * This method update reservation state to READY.
     * Reservation state must be ASSIGNED, state change to READY, ready to lock into a table
     * @param reservationId 
     * @returns updated reservation 
     */
    public async changeReservationStateToReady(reservationId: string) {
        const reservation
            = await ReservationRepository.getReservationById(reservationId)
        if (reservation == null) {
            throw new NotFoundError(ResourceName.RESERVATION, reservationId)
        }
        else if (reservation.state != ReservationState.ASSIGNED) {
            throw new MissingConditionError(ResourceName.RESERVATION, "State must be ASSIGNED")
        }

        const updateData = {
            state: ReservationState.READY
        }

        return await ReservationRepository.updateReservationById(reservationId, updateData)
    }

    /**
     * This method CANCEL a reservation.
     * If reservation is LOCKED -> table is LOCKED, then change table state to FREE
     * @param reservationId 
     * @returns updated reservation 
     */
    public async cancelReservation(reservationId: string) {
        const reservation = await ReservationRepository.getReservationById(reservationId)
        if (reservation?.state == ReservationState.LOCKED && reservation.assignedTableId != null) {
            TableRepository.updateTableStateById(reservation.assignedTableId, TableState.FREE)
        }
        return await ReservationRepository.updateReservationStateById(reservationId, ReservationState.CANCEL)
    }

    /**
     * This method lock a table by a reservation,
     * Reservation state must be READY and Table state is FREE
     * Table state is changed to LOCKED, reservation state is changed to LOCKED
     * @param tableId
     * @param reservationId 
     */
    public async lockTableForReservation(tableId: string, reservationId: string) {
        const table = await TableRepository.getTableWithReservationsById(tableId)
        const reservation = await ReservationRepository.getReservationById(reservationId)
        if (table == null) {
            throw new NotFoundError(ResourceName.TABLE, tableId)
        }
        else if (reservation == null) {
            throw new NotFoundError(ResourceName.RESERVATION, reservationId)
        }
        else if (table.state != TableState.FREE) {
            throw new MissingConditionError(ResourceName.TABLE, "State must be FREE")
        }
        else if (reservation.state != ReservationState.READY) {
            throw new MissingConditionError(ResourceName.RESERVATION, "State must be READY")
        }

        TableRepository.updateTableStateById(tableId, TableState.LOCKED)
        return await ReservationRepository.updateReservationById(reservationId, {
            state: ReservationState.LOCKED,
            assignedTableId: tableId
        })

    }

    /**
     * This method init an order for booked customer (for reservation) when customer arrive
     * Reservation state and table state must be LOCKED
     * State of reservation change to DONE, and state of table change to INPROGRESS
     * @param tableId
     * @param reservationId
     * @returns initiated order
     */
    public async initOrderForReservation(tableId: string, reservationId: string) {
        const table = await TableRepository.getTableWithReservationsById(tableId)
        const reservation = await ReservationRepository.getReservationById(reservationId)
        if (table == null) {
            throw new NotFoundError(ResourceName.TABLE, tableId)
        }
        else if (reservation == null) {
            throw new NotFoundError(ResourceName.RESERVATION, reservationId)
        }
        else if (reservation.state != ReservationState.LOCKED) {
            throw new MissingConditionError(ResourceName.RESERVATION, "State must be LOCKED")
        }
        else if (reservation.assignedTableId != tableId) {
            throw new MissingConditionError(ResourceName.RESERVATION, "The table is not assigned for this reservation")
        }
        await TableRepository.updateTableStateById(tableId, TableState.INPROGRESS)
        await ReservationRepository.updateReservationStateById(reservationId, ReservationState.DONE)
        return await OrderRepository.createNewOrder(tableId, reservation.customerId)

    }

}

export default new OperationService