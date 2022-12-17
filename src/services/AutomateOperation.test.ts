import { clearInterval } from 'timers'
import Locals from '../providers/Locals'
import TableRepository from '../repositories/TableRepository'
import {
    generateRandomTables,
    generateRandomBookedCustomers,
    generateReservation,
    getAllReservationsToday,
    randomAssignedTable,
    autoUnlockReservation,
    dropReservationToday
} from '../testFunction'
import AutomateOperation from './AutomateOperation'

export async function createScenario(callback: Function) {
    console.log("HELOOO")

    dropReservationToday()
    const timeSlot = await generateReservation(
        70,
        Locals.config().automateDurationInSeconds * 2,
        Locals.config().automateDurationInSeconds
    )
    console.log("Time slot: ", timeSlot)

    callback()

    const timeId = AutomateOperation.start()

    setTimeout(() => {
        clearInterval(timeId)
        console.log("_________________________________________ Stop _________________________________________")
    }, (Locals.config().automateDurationInSeconds * (timeSlot.length + 10)) * 1000)
}

// createScenario()