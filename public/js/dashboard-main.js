import { currentTime } from "./utils/clock.js";

// clock
setInterval(()=>{
    const clock = document.getElementById("clock")
    clock.innerHTML = currentTime()
}, 10)

const tablesData = tables
const reservationsData = reservations

const listBookedCustomers = document.getElementsByClassName("ordered-customers-item")
console.log(listBookedCustomers)
for (let index = 0; index < listBookedCustomers.length; index++) {
    listBookedCustomers[index].addEventListener("click", popUpMatchedTables)   
}

function popUpMatchedTables(e) {
    const id = e.currentTarget.id
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

