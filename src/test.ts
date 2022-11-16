import { BookedCustomer, Reservation } from '@prisma/client';
// import { Command } from 'commander';
import TableRepository from "./repositories/TableRepository";
import { randomNumber } from './utils/mathUtils';
import CustomerRepository from "./repositories/CustomerRepository";
import { time } from 'console';
import ReservationRepository from './repositories/ReservationRepository';
import OperationService from './services/OperationService';


// Test generate random table

// TableRepository.generateRandomTables(10)
//     .then(tables => {
//         console.log(tables)
//     })
// TableRepository.getAllSortedTables()
//     .then(tables => {
//         console.log(tables)
//     })

// Test generate random customers
// CustomerRepository.generateRandomBookedCustomers(10)
//     .then((customers: BookedCustomer[]) => {
//         console.log(customers)
//     })


// Test generate reservation
// const bookingTime = new Date()
// bookingTime.setDate(bookingTime.getDate() + 20)
// CustomerRepository.addNewReservation(
//     bookingTime, 4, 
//     '78d6c5d8-001c-4606-b0ee-5be11f05b979',
//     'f60db947-aa07-4108-8eb1-ff64a3821668')
//     .then((reservation: Reservation) => {
//         // console.log(reservation)
//     })

// CustomerRepository.getAllReservationsToday()
//     .then((reservations: Reservation[]) => {
//         console.log(reservations)
//     })

// CustomerRepository.getAllBookedCustomer()
//     .then(async (customers: BookedCustomer[]) => {
//         const length = customers.length
//         for (let index = 0; index < 10; index++) {
//             const randomIndex = randomNumber(0, length - 1)
//             const time = new Date()
//             time.setHours(time.getHours() + randomNumber(0, 5))
//             ReservationRepository.addNewReservation(
//                 new Date(),
//                 randomNumber(0, 10),
//                 customers[randomIndex].customerId,
//                 'f60db947-aa07-4108-8eb1-ff64a3821668'
//             )
//         }
//     })


OperationService.assignTableForReservation(
    "346ae894-09a6-404f-9021-0463ee8a3937",
    "9b98eecc-b7c0-408d-857e-2c2dc5b33572"
)
    .then(obj => {
        console.log(obj)
    })
