import { clearInterval } from 'timers'
import Locals from '../providers/Locals'
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

async function createScenario() {
    dropReservationToday()
    const timeSlot = await generateReservation(10, Locals.config().automateDurationInSeconds * 2, Locals.config().automateDurationInSeconds)
    console.log("Time slot: ", timeSlot)


    const timeId = AutomateOperation.start()

    setTimeout(() => {
        clearInterval(timeId)
        console.log("_________________________________________ Stop _________________________________________")
    }, (Locals.config().automateDurationInSeconds * (timeSlot.length + 10)) * 1000)
}

createScenario()

