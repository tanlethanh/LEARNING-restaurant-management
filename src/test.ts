import { BookedCustomer, NewCustomer, Reservation, ReservationState, Table } from '@prisma/client';
// import { Command } from 'commander';
import TableRepository from "./repositories/TableRepository";
import { randomNumber } from './utils/mathUtils';
import CustomerRepository from "./repositories/CustomerRepository";
import { table, time } from 'console';
import ReservationRepository from './repositories/ReservationRepository';
import OperationService from './services/OperationService';
import { endToday, startToday } from './utils/dateUtils';

function generateRandomTables(count: number = 20) {
    TableRepository.generateRandomTables(20)
        .then(tables => {
            TableRepository.getAllSortedTables()
                .then(tables => {
                    console.log(tables)
                })
        })

}

function generateRandomBookedCustomers(count: number = 30) {
    CustomerRepository.generateRandomBookedCustomers(count)
        .then((customers: BookedCustomer[]) => {
            console.log(customers)
        })
}

function generateRandomNewCustomers(count: number = 30) {
    CustomerRepository.generateRandomNewCustomers(count)
        .then((customers: NewCustomer[]) => {
            console.log(customers)
        })
}

function generateReservation(count: number = 20) {
    CustomerRepository.getAllBookedCustomer()
        .then(async (customers: BookedCustomer[]) => {
            const length = customers.length
            for (let index = 0; index < count; index++) {
                const time = new Date()
                time.setHours(time.getHours() + randomNumber(0, 5))

                ReservationRepository.createNewReservation(
                    time,
                    randomNumber(0, 8),
                    customers[randomNumber(0, length - 1)].customerId
                )
            }
        })
}

function getAllReservationsToday() {
    ReservationRepository.getAllReservationsToday()
        .then((reservations: Reservation[]) => {
            console.log(reservations)
        })
}

async function randomAssignedTable() {
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

async function autoUnlockReservation(chance: number = 0.5) {
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


console.log("test")
// generateReservation()
// getAllReservationsToday()
// randomAssignedTable()
// autoUnlockReservation()
OperationService.lockTableForReservation( '09d55449-da22-4cea-8eea-0e0a8c3aecfb','27006f67-bf51-4159-8e83-a67722b58cb9')
// generateRandomTables()
// generateRandomNewCustomers()
// generateRandomBookedCustomers()