import { fetchAssignTableForReservation, fetchInitOrder } from "./fetch-operation.js";
import { currentTime } from "./utils/clock.js";
import { createYesNoModal } from "./utils/modal.js";
import NotificationQueue from './utils/notify.js'

// parse global variable
const tablesData = tables
const reservationsData = reservations
let chosenReservation = null
let listPopupTables = null


// Helpers
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
    const table = findById(tablesData, event.currentTarget.id)
    let reservation = findById(reservationsData, chosenReservation ? chosenReservation.id : "")
    if (
        chosenReservation != null
        && reservation.state == "READY"
        && event.currentTarget.classList.contains("popup")
    ) {
        const title = `Bạn có muốn gán <strong>Bàn số ${table.tableNumber}</strong> 
                cho <strong>${reservation.customer.firstName}</strong>?`
        createYesNoModal(title, async () => {
            let response = await fetchAssignTableForReservation(chosenReservation.id, table.id)

            console.log("Fetch - Assign table for reservation")
            response = await response.json()
            const updatedReservation = response.reservation

            if (updateReservations) {
                NotificationQueue.enqueue({
                    status: "success",
                    title: `Gán bàn thủ công`,
                    text: `Bàn số ${updatedReservation.assignedTable.tableNumber}
                     đã gán cho ${updatedReservation.customer.firstName}`,
                    updatedReservation: updatedReservation,
                    callback: function lockTable() {
                        unPopupTables()
                        lockedTableForReservation(this.updatedReservation)
                    }
                })
            }
            else {
                NotificationQueue.enqueue({
                    status: "error",
                    title: `Gán bàn thủ công`,
                    text: `Bàn số ${updatedReservation.assignedTable.tableNumber}
                     gán thất bại, vui lòng tải lại trang!`                })
            }

        })

    }
    else if (table.state == "LOCKED") {
        for (let i = 0; i < reservationsData.length; i++) {
            const element = reservationsData[i];
            if (element.assignedTableId == table.id) {
                reservation = element
                break
            }
        }
        const title = `Bạn có muốn khởi tạo đơn hàng tại <strong>Bàn số ${table.tableNumber}</strong> 
                cho khách hàng <strong>${reservation.customer.firstName}</strong>?`

        createYesNoModal(title, async () => {
            const response = await fetchInitOrder(reservation.id, table.id)
            console.log(await response.json())
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

// For socket communication

function updateReservations(updatedReservation) {
    console.log("Update reservations data")
    for (let i = 0; i < reservationsData.length; i++) {
        if (reservationsData[i].id == updatedReservation.id) {
            reservationsData[i] = updatedReservation
            break;
        }
    }
}

function updateTables(updatedTable) {
    console.log("Update tables data")
    for (let i = 0; i < reservationsData.length; i++) {
        if (tablesData[i].id == updatedTable.id) {
            tablesData[i] = updatedTable
            break;
        }
    }
}

function assignReservation(updatedReservation) {
    // console.log(updatedReservation)
    console.log("Update reservation after assign")
    console.log(updatedReservation.id)
    const element = document.getElementById(updatedReservation.id)
    element.classList.add("locked")

    // Create locked icon
    const icon = document.createElement("i")
    icon.classList.add("fa-solid", "fa-lock")
    element.appendChild(icon)
}

function freeReservation(updatedReservation) {
    console.log("Unlock reservation for manually locking")
    const element = document.getElementById(updatedReservation.id)
    element.classList.remove("locked")
    element.classList.add("unlock")

    // Create locked icon
    const icon = document.createElement("i")
    icon.classList.add("fa-solid", "fa-lock-open")
    element.appendChild(icon)
}

function lockedTableForReservation(updatedReservation) {
    console.log("Locked table for reservation ", updatedReservation)
    updateTables(updatedReservation.assignedTable)
    const reservationElement = document.getElementById(updatedReservation.id)

   if (reservationElement) {
        reservationElement.remove()
   }
    // if (reservationElement.classList.contains("locked")) {
    //     reservationElement.classList.remove("locked")
    // }
    // if (reservationElement.classList.contains("unlock")) {
    //     reservationElement.classList.remove("unlock")
    // }
    // reservationElement.classList.add("done")

    // const icon = reservationElement.getElementsByTagName("i")[0]
    // reservationElement.removeChild(icon)

    const tableElement = document.getElementById(updatedReservation.assignedTableId)
    tableElement.classList.add("locked")
    tableElement.classList.remove("unlock")
    tableElement.querySelector(".main-table-item-right > h2").innerHTML = updatedReservation.customer.firstName

}


// Main here

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

const socket = io();

socket.on("notification", (noti) => {
    // console.log(noti)
    noti = JSON.parse(noti)
    noti.callback = function notiCallback() {
        updateReservations(this.updatedReservation)
        switch (this.type) {
            case "AUTO_ASSIGN":
                if (this.status == "success") {
                    assignReservation(this.updatedReservation)
                }
                break
            case "AUTO_UNLOCK":
                if (this.status == "success") {
                    lockedTableForReservation(this.updatedReservation)
                }
                else if (this.status == "warning") {
                    freeReservation(this.updatedReservation)
                }
                break
        }

    }

    NotificationQueue.enqueue(noti)
});

socket.on("refresh page", (message) => {
    console.log("__ Refresh! __ ", message)
    location.reload()
})
