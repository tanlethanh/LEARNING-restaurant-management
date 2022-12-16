import { BookedCustomer, Reservation } from '@prisma/client';
// import { Command } from 'commander';
import TableRepository from "./repositories/TableRepository";
import { randomNumber } from './utils/mathUtils';
import CustomerRepository from "./repositories/CustomerRepository";
import { time } from 'console';
import ReservationRepository from './repositories/ReservationRepository';
import OperationService from './services/OperationService';
import UserRepository from "./repositories/UserRepository";
import { Prisma, Order, UserRole } from "@prisma/client"
import { User } from '@prisma/client'
import {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createRefreshJWT,
} from "./utils/jwtUtils";

// UserRepository.getUserByUsername("hung")
//     .then(user => {
//         if (user) {
//             console.log(createJWT({ firstName: user.firstName, lastName: user.lastName, id: user.id }));
//         }
//     })
// UserRepository.generateUserDB()
import { generateReservation, generateRandomBookedCustomers, generateRandomNewCustomers, generateRandomTables } from './testFunction'
import { init } from './init';
// generateRandomBookedCustomers();
// generateRandomTables()
// generateRandomNewCustomers();
// generateReservation()

// init()

// import { createSampleData } from './data/createData'

// createSampleData()
// TableRepository.getTableWithReservationsById("c70d9ffc-296d-4ebe-8fea-c3e9cd458f65", true).then((res) => console.log(res));

