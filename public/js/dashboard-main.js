// import { Z_ASCII } from "zlib";
import {
  fetchAssignTableForReservation,
  fetchInitOrder,
} from "./fetch-operation.js";
import { currentTime } from "./utils/clock.js";
import { createYesNoModal } from "./utils/modal.js";
// parse global variable
const tablesData = tables;
const reservationsData = reservations;
let chosenReservation = null;
let listPopupTables = null;

let chosenCustomer = null;
const customersData = newCustomers;

// clock
setInterval(() => {
  const clock = document.getElementById("clock");
  clock.innerHTML = currentTime();
}, 10);

// onlick event for all reservation item
const listBookedCustomers = document.getElementsByClassName(
  "ordered-customers-item"
);
for (let i = 0; i < listBookedCustomers.length; i++) {
  listBookedCustomers[i].addEventListener("click", reservationOnClick);
}

const listTables = document.getElementsByClassName("main-table-item");
for (let i = 0; i < listTables.length; i++) {
  const element = listTables[i];
  element.addEventListener("click", tableOnClick);
}

function reservationOnClick(event) {
  if (
    chosenReservation != null &&
    chosenReservation.id == event.currentTarget.id
  ) {
    chosenReservation.classList.remove("chosen");
    chosenReservation = null;
    unPopupTables();
  } else {
    if (chosenReservation != null) {
      chosenReservation.classList.remove("chosen");
    }
    chosenReservation = event.currentTarget;
    chosenReservation.classList.add("chosen");
    unPopupTables();
    const reservation = findById(reservationsData, chosenReservation.id);
    if (reservation != null && reservation.state == "READY") {
      popUpMatchedTables(chosenReservation);
    }
  }
}

async function tableOnClick(event) {
  const table = findById(tablesData, event.currentTarget.id);
  let reservation = findById(
    reservationsData,
    chosenReservation ? chosenReservation.id : ""
  );
  let customer = findCusById(
    customersData,
    chosenCustomer ? chosenCustomer.id : ""
  );

  if (
    chosenReservation != null &&
    reservation.state == "READY" &&
    event.currentTarget.classList.contains("popup")
  ) {
    const title = `Bạn có muốn gán <strong>Bàn số ${table.tableNumber}</strong> 
                cho <strong>${reservation.customer.firstName}</strong>?`;
    createYesNoModal(title, async () => {
      const response = await fetchAssignTableForReservation(
        chosenReservation.id,
        table.id
      );
      console.log(await response.json());
    });
  } else if (table.state == "LOCKED") {
    for (let i = 0; i < reservationsData.length; i++) {
      const element = reservationsData[i];
      if (element.assignedTableId == table.id) {
        reservation = element;
        break;
      }
    }
    const title = `Bạn có muốn khởi tạo đơn hàng tại <strong>Bàn số ${table.tableNumber}</strong> 
                cho khách hàng <strong>${reservation.customer.firstName}</strong>?`;
    createYesNoModal(title, async () => {
      const response = await fetchInitOrder(reservation.id, table.id);
      console.log(await response.json());
    });
  }
  // check for new customer
  else if (
    chosenCustomer != null &&
    event.currentTarget.classList.contains("popup")
  ) {
    const title = `Bạn có muốn gán <strong>Bàn số ${table.tableNumber}</strong> 
                cho khách hàng số <strong>${customer.ordinamNumber}</strong>?`;
    createYesNoModal(title, alert("xin chao"));
  }
}

function popUpMatchedTables(currentTarget) {
  const id = currentTarget.id;
  let curReservation;

  // Get current reservation object by id
  for (let index = 0; index < reservationsData.length; index++) {
    const element = reservationsData[index];
    if (element.id == id) {
      curReservation = element;
      break;
    }
  }

  // Pop up all tables available for this reservation
  tablesData.map((table) => {
    if (
      table.numberOfSeats >= curReservation.numberOfPeople &&
      table.state == "FREE"
    ) {
      const tableElement = document.getElementById(table.id);
      if (!tableElement.classList.contains("popup")) {
        tableElement.classList.add("popup");
      } else {
        tableElement.classList.remove("popup");
      }
    }
  });
}

function unPopupTables() {
  const tables = document.getElementsByClassName("main-table-item");
  for (let i = 0; i < tables.length; i++) {
    tables[i].classList.remove("popup");
  }
}

function findById(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id == id) return list[i];
  }
  return null;
}

// onlick event for all newCustomer

const listNewCustomer = document.getElementsByClassName(
  "newCustomer-unassigned"
);

for (let i = 0; i < listNewCustomer.length; i++) {
  const element = listNewCustomer[i];
  if (element) {
    element.addEventListener("click", customerOnClick);
  }
}

function customerOnClick(event) {
  if (chosenCustomer != null)
    console.log(chosenCustomer.customerId, event.currentTarget.id);
  if (chosenCustomer != null && chosenCustomer.id == event.currentTarget.id) {
    chosenCustomer.classList.remove("chosen");
    chosenCustomer = null;
    unPopupTables();
  } else {
    if (chosenCustomer != null) {
      chosenCustomer.classList.remove("chosen");
    }
    chosenCustomer = event.currentTarget;
    chosenCustomer.classList.add("chosen");
    unPopupTables();
    const customer = findCusById(customersData, chosenCustomer.id);
    if (customer != null) {
      popUpCusMatchedTables(chosenCustomer);
    }
  }
}

function findCusById(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].customerId == id) return list[i];
  }
  return null;
}

function popUpCusMatchedTables(currentTarget) {
  const id = currentTarget.id;
  let curCustomer;

  // Get current reservation object by id
  for (let index = 0; index < customersData.length; index++) {
    const element = customersData[index];
    if (element.customerId == id) {
      curCustomer = element;
      break;
    }
  }

  // Pop up all tables available for this reservation
  tablesData.map((table) => {
    if (
      table.numberOfSeats >= curCustomer.numberOfSeats &&
      table.state == "FREE"
    ) {
      const tableElement = document.getElementById(table.id);
      if (!tableElement.classList.contains("popup")) {
        tableElement.classList.add("popup");
      } else {
        tableElement.classList.remove("popup");
      }
    }
  });
}

function noneCallback() {}
