import { BookedCustomer, Customer, Reservation, ReservationState, Table, TableState } from '@prisma/client';
// import { Command } from 'commander';
import TableRepository from "./repositories/TableRepository";
import { randomNumber } from './utils/mathUtils';
import CustomerRepository from "./repositories/CustomerRepository";
import { table, time } from 'console';
import ReservationRepository from './repositories/ReservationRepository';
import OperationService from './services/OperationService';
import { endToday, startToday } from './utils/dateUtils';


export async function dropReservationToday() {
    console.log("Drop all reservation today - Development only\n")
    const result1 = await ReservationRepository.deleteAllReservationsToday()
    const result2 = await TableRepository.updateAllTableStates(TableState.FREE)
    console.log(result1)
    console.log(result2)
    console.log("---------------------------------------------\n")
}

export function generateRandomTables(count: number = 20) {
    TableRepository.generateRandomTables(20)
        .then(tables => {
            TableRepository.getAllSortedTables()
                .then(tables => {
                    console.log(tables)
                })
        })

}

export function generateRandomBookedCustomers(count: number = 30) {
    CustomerRepository.generateRandomBookedCustomers(count)
        .then((customers: BookedCustomer[]) => {
            console.log(customers)
        })
}


/**
 * 
 * @param count number of reservations
 * @param startPadding (s)
 * @param durationSpace (s)
 * @returns count number of reservation in each time slot [0 -> 5]
 */
export async function generateReservation(count: number = 20, startPadding = 0, durationSpace = 1 * 60 * 60) {
    const customers: BookedCustomer[] = await CustomerRepository.getAllBookedCustomer()
    const length = customers.length
    const timeSlot = [0, 0, 0, 0, 0, 0]

    for (let index = 0; index < count; index++) {
        const time = new Date()
        const ranNum: number = randomNumber(0, 5)
        timeSlot[ranNum] += 1
        time.setSeconds(startPadding + time.getSeconds() + ranNum * durationSpace)

        await ReservationRepository.createNewReservation(
            time,
            randomNumber(1, 8),
            customers[randomNumber(0, length - 1)].customerId
        )
    }
    return timeSlot
}

export function getAllReservationsToday() {
    ReservationRepository.getAllReservationsToday()
        .then((reservations: Reservation[]) => {
            console.log(reservations)
        })
}

export async function randomAssignedTable() {
    const tables: Table[] | undefined = await TableRepository.getAllSortedTables()
    if (!tables) return
    const reservations = await ReservationRepository.getAllReservationsToday()
    for (let i = 0; i < 10; i++) {
        try {
            await OperationService.assignTableForReservation(
                reservations[randomNumber(0, reservations.length - 1)].id,
                tables[randomNumber(0, tables.length - 1)].id
            )
        } catch (error) {
            continue
        }

    }
}

export async function autoUnlockReservation(chance: number = 0.5) {
    if (chance < 0 || chance > 1) chance = 0.5
    const reservations = await ReservationRepository.getAllReservationsByStateInDate(ReservationState.ASSIGNED)
    for (let i = 0; i < reservations.length; i++) {
        const element = reservations[i];
        try {
            const ran = Math.random()
            if (ran <= chance) {
                await OperationService.changeReservationStateToReady(element.id)
            }
        }
        catch (error) {
            continue
        }
    }

}