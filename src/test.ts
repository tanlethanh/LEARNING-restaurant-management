import { BookedCustomer, Reservation } from '@prisma/client';
// import { Command } from 'commander';
import TableRepository from "./repositories/TableRepository";
import { randomNumber } from './utils/mathUtils';
import CustomerRepository from "./repositories/CustomerRepository";
import { time } from 'console';
import ReservationRepository from './repositories/ReservationRepository';
import OperationService from './services/OperationService';
import UserRepository from "./repositories/UserRepository";
import { Prisma,Order, UserRole } from "@prisma/client"
import {User}from '@prisma/client'
import {    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createRefreshJWT,} from "./utils/jwtUtils";

 UserRepository.getUserByUsername("hung")
 .then(user => {
    if(user){
        console.log(createJWT({firstName:user.firstName, lastName:user.lastName, id:user.id}));
    }
 })



// const DEFAULT_TABLE_ID = "f60db947-aa07-4108-8eb1-ff64a3821668"

// Test generate random table

// TableRepository.generateRandomTables(10)
//     .then(tables => {
//         console.log(tables)
//     })
// TableRepository.getAllSortedTables()
//     .then(tables => {
//         console.log(tables)
//     })

// Test generate random reservations
// CustomerRepository.generateRandomBookedCustomers(10)
//     .then((customers: BookedCustomer[]) => {
//         console.log(customers)
//     })


// Test generate reservation
// const bookingTime = new Date()
// bookingTime.setDate(bookingTime.getDate() + 20)
// ReservationRepository.addNewReservation(
//     bookingTime, 4, 
//     '78d6c5d8-001c-4606-b0ee-5be11f05b979',
//     'f60db947-aa07-4108-8eb1-ff64a3821668')
//     .then((reservation: Reservation) => {
//         console.log(reservation)
//     })

// ReservationRepository.getAllReservationsToday()
//     .then((reservations: Reservation[]) => {
//         console.log(reservations)
//     })

// Generete reservations
// CustomerRepository.getAllBookedCustomer()
//     .then(async (customers: BookedCustomer[]) => {
//         const length = customers.length
//         for (let index = 0; index < 17; index++) {
//             const time = new Date()
//             time.setHours(time.getHours() + randomNumber(0, 5))

//             ReservationRepository.addNewReservation(
//                 time,
//                 randomNumber(0, 10),
//                 customers[randomNumber(0, length - 1)].customerId,
//                 DEFAULT_TABLE_ID
//             )
//         }
//     })


// OperationService.assignTableForReservation(
//     "8f13b1ed-f204-46bd-a59f-9aec1f03b769",
//     "7e72b9cf-9524-4437-8f51-1046ce6b2d9e"
// )
//     .then(obj => {
//         console.log(obj)
//     })

// OperationService.unlockReservation('70886382-1482-4c44-b767-01a5a6dce59b')
//     .then(reservation => {
//         console.log(reservation)
//     })


//C:\Users\Lê Quốc Hung\Desktop\project\Restaurent-Project\src\test.ts