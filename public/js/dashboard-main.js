import { fetchAssignTableForReservation } from "./fetch-operation.js";
import { currentTime } from "./utils/clock.js";
import { createYesNoModal } from "./utils/modal.js";

// parse global variable
const tablesData = tables
const reservationsData = reservations
let chosenReservation = null
let listPopupTables = null

// clock
setInterval(() => {
    const clock = document.getElementById("clock")
    clock.innerHTML = currentTime()
}, 10)

// onlick event for all reservation item
const listBookedCustomers = document.getElementsByClassName("ordered-customers-item")
for (let i = 0; i < listBookedCustomers.length; i++) {
    listBookedCustomers[i].addEventListener("click", reservationOnClick)
}

const listTables = document.getElementsByClassName("main-table-item")
for (let i = 0; i < listTables.length; i++) {
    const element = listTables[i];
    element.addEventListener('click', tableOnClick)
}


function reservationOnClick(event) {

    if (chosenReservation != null &&
        chosenReservation.id == event.currentTarget.id
    ) {
        chosenReservation.classList.remove("chosen")
        chosenReservation = null
        unPopupTables()
    }
    else {
        if (chosenReservation != null) {
            chosenReservation.classList.remove("chosen")
        }
        chosenReservation = event.currentTarget
        chosenReservation.classList.add("chosen")
        unPopupTables()
        const reservation = findById(reservationsData, chosenReservation.id)
        if (reservation != null && reservation.state == "READY") {
            popUpMatchedTables(chosenReservation)
        }
    }

}

function tableOnClick(event) {
    if (chosenReservation == null) return
    const reservation = findById(reservationsData, chosenReservation.id)
    const table = findById(tablesData, event.currentTarget.id)
    if (reservation.state == "READY" && event.currentTarget.classList.contains("popup")) {
        const title = `Bạn có muốn gán <strong>Bàn số ${table.tableNumber}</strong> 
        cho <strong> ${reservation.customer.firstName} </strong>`
        createYesNoModal(title, async ()=> {
            const response = await fetchAssignTableForReservation(chosenReservation.id, table.id)
            console.log(response)
        })
    }
}

function popUpMatchedTables(currentTarget) {
    const id = currentTarget.id
    let curReservation

    // Get current reservation object by id
    for (let index = 0; index < reservationsData.length; index++) {
        const element = reservationsData[index];
        if (element.id == id) {
            curReservation = element
            break
        }
    }

    // Pop up all tables available for this reservation
    tablesData.map(table => {
        if (table.numberOfSeats >= curReservation.numberOfPeople
            && table.state == "FREE"
        ) {
            const tableElement = document.getElementById(table.id)
            if (!tableElement.classList.contains("popup")) {
                tableElement.classList.add("popup")
            }
            else {
                tableElement.classList.remove("popup")
            }
        }
    })



}

function unPopupTables() {
    const tables = document.getElementsByClassName("main-table-item")
    for (let i = 0; i < tables.length; i++) {
        tables[i].classList.remove("popup")
    }
}

function findById(list, id) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].id == id) return list[i]
    }
    return null;
}

function noneCallback() {

}


