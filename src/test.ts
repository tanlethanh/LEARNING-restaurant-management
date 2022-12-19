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

import { init } from "./init"

import {
    generateReservation,
    generateRandomBookedCustomers,
    generateRandomNewCustomers,
    generateRandomTables
} from './testFunction'

